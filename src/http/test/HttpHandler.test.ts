import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { HandlerConfig, RequestConfig } from "@/http/types";
import { HttpHandler } from "../request/HttpHandler";

const mockFetch = vi.fn();
const mockAbortController = {
  abort: vi.fn(),
  signal: { aborted: false },
};

Object.defineProperty(globalThis, "fetch", {
  value: mockFetch,
  writable: true,
});

Object.defineProperty(globalThis, "AbortController", {
  value: vi.fn(() => mockAbortController),
  writable: true,
});

describe("HttpHandler", () => {
  let httpHandler: HttpHandler;

  beforeEach(() => {
    httpHandler = new HttpHandler();
    vi.clearAllMocks();
    mockFetch.mockClear();
    mockAbortController.abort.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("configure", () => {
    it("should configure handler properties", () => {
      const config: HandlerConfig = {
        baseURL: "https://api.example.com",
        maxRetries: 5,
        defaultTimeout: 15000,
        withCredentials: false,
        defaultHeaders: { Authorization: "Bearer token" },
      };

      expect(() => httpHandler.configure(config)).not.toThrow();
    });
  });

  describe("parseResponse", () => {
    it("should parse JSON response", async () => {
      const mockJsonData = { id: 1, name: "Test" };
      const mockResponse = {
        headers: {
          get: vi.fn(() => "application/json"),
        },
        json: vi.fn().mockResolvedValue(mockJsonData),
      } as unknown as Response;

      const result =
        await httpHandler.parseResponse<typeof mockJsonData>(mockResponse);

      expect(result).toEqual(mockJsonData);
    });

    it("should parse text response", async () => {
      const mockTextData = "Plain text response";
      const mockResponse = {
        headers: {
          get: vi.fn(() => "text/plain"),
        },
        text: vi.fn().mockResolvedValue(mockTextData),
      } as unknown as Response;

      const result = await httpHandler.parseResponse<string>(mockResponse);

      expect(result).toBe(mockTextData);
    });
  });

  describe("executeRequest", () => {
    it("should execute successful GET request", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: { get: vi.fn() },
      } as unknown as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const result = await httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it("should handle request with query parameters", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as unknown as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        params: { page: "1", limit: "10" },
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?page=1&limit=10",
        expect.objectContaining({
          method: "GET",
        }),
      );
    });

    it("should handle POST request with JSON data", async () => {
      const mockResponse = {
        ok: true,
        status: 201,
      } as unknown as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const requestData = { name: "John", email: "john@example.com" };
      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "POST",
        data: requestData,
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestData),
        }),
      );
    });

    it("should handle request with string data", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as unknown as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "POST",
        data: "raw string data",
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          body: "raw string data",
        }),
      );
    });

    it("should handle timeout error", async () => {
      const timeoutError = new DOMException("Request timeout", "AbortError");
      mockFetch.mockRejectedValue(timeoutError);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        timeout: 5000,
      };

      await expect(
        httpHandler.executeRequest("https://api.example.com/users", config),
      ).rejects.toThrow("Request timeout after 5000ms");
    });

    it("should retry on server error for GET request", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      // Premier appel échoue, deuxième réussit
      mockFetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const mockSetTimeout = vi.spyOn(global, "setTimeout");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockSetTimeout.mockImplementation((callback: any): any => {
        callback();
        return 1;
      });

      const result = await httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      mockSetTimeout.mockRestore();
    });

    it("should not retry for POST request on server error", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
      } as Response;

      mockFetch.mockResolvedValue(serverErrorResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "POST",
      };

      const result = await httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(serverErrorResponse);
    });

    it("should not retry on 4xx client errors", async () => {
      const clientErrorResponse = {
        ok: false,
        status: 400,
      } as Response;

      mockFetch.mockResolvedValue(clientErrorResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const result = await httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(clientErrorResponse);
    });

    it("should retry on 429 rate limit error", async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const mockSetTimeout = vi.spyOn(global, "setTimeout");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockSetTimeout.mockImplementation((callback: any): any => {
        callback();
        return 1;
      });

      const result = await httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      mockSetTimeout.mockRestore();
    });

    it("should use withCredentials configuration", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      httpHandler.configure({
        baseURL: "https://api.example.com",
        maxRetries: 3,
        defaultTimeout: 10000,
        withCredentials: false,
        defaultHeaders: {},
      });

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          credentials: "same-origin",
        }),
      );
    });

    it("should handle empty params object", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        params: {},
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users", // Pas de query string
        expect.any(Object),
      );
    });

    it("should throw error after max retries exceeded", async () => {
      const networkError = new Error("Network error");
      mockFetch.mockRejectedValue(networkError);

      httpHandler.configure({
        baseURL: "https://api.example.com",
        maxRetries: 2,
        defaultTimeout: 10000,
        withCredentials: true,
        defaultHeaders: {},
      });

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const mockSetTimeout = vi.spyOn(global, "setTimeout");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockSetTimeout.mockImplementation((callback: any): any => {
        callback();
        return 1;
      });

      await expect(
        httpHandler.executeRequest("https://api.example.com/users", config),
      ).rejects.toThrow("Network error");

      expect(mockFetch).toHaveBeenCalledTimes(2);

      mockSetTimeout.mockRestore();
    });
  });
  describe("parseResponse - additional content types", () => {
    it("should handle response with charset in content-type", async () => {
      const mockJsonData = { id: 1, name: "Test" };
      const mockResponse = {
        headers: {
          get: vi.fn(() => "application/json; charset=utf-8"),
        },
        json: vi.fn().mockResolvedValue(mockJsonData),
      } as unknown as Response;

      const result =
        await httpHandler.parseResponse<typeof mockJsonData>(mockResponse);
      expect(result).toEqual(mockJsonData);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should handle response with no content-type header", async () => {
      const mockTextData = "No content type";
      const mockResponse = {
        headers: {
          get: vi.fn(() => null),
        },
        text: vi.fn().mockResolvedValue(mockTextData),
      } as unknown as Response;

      const result = await httpHandler.parseResponse<string>(mockResponse);
      expect(result).toBe(mockTextData);
      expect(mockResponse.text).toHaveBeenCalled();
    });

    it("should handle empty response body", async () => {
      const mockResponse = {
        headers: {
          get: vi.fn(() => "text/plain"),
        },
        text: vi.fn().mockResolvedValue(""),
      } as unknown as Response;

      const result = await httpHandler.parseResponse<string>(mockResponse);
      expect(result).toBe("");
    });
  });

  describe("HTTP methods", () => {
    const methods = ["PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

    methods.forEach((method) => {
      it(`should handle ${method} requests`, async () => {
        const mockResponse = {
          ok: true,
          status: 200,
        } as Response;

        mockFetch.mockResolvedValue(mockResponse);

        const config: RequestConfig = {
          url: "https://api.example.com/resource",
          method: method,
        };

        await httpHandler.executeRequest(
          "https://api.example.com/resource",
          config,
        );

        expect(mockFetch).toHaveBeenCalledWith(
          "https://api.example.com/resource",
          expect.objectContaining({
            method: method,
          }),
        );
      });
    });
  });

  describe("query parameters edge cases", () => {
    it("should handle special characters in query parameters", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/search",
        method: "GET",
        params: {
          query: "test@example.com",
          filter: "name:John Doe",
          special: "a&b=c",
        },
      };

      await httpHandler.executeRequest(
        "https://api.example.com/search",
        config,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("query=test%40example.com"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter=name%3AJohn+Doe"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("special=a%26b%3Dc"),
        expect.any(Object),
      );
    });

    it("should handle undefined and null param values", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/search",
        method: "GET",
        params: {
          valid: "value",
          undefined: "undefined",
          null: "null",
        },
      };

      await httpHandler.executeRequest(
        "https://api.example.com/search",
        config,
      );

      const callArgs = mockFetch.mock.calls[0][0];
      expect(callArgs).toContain("valid=value");
      expect(callArgs).toContain("undefined=undefined");
      expect(callArgs).toContain("null=null");
    });
  });

  describe("configuration edge cases", () => {
    it("should use default values when not configured", async () => {
      const newHandler = new HttpHandler();
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      await newHandler.executeRequest("https://api.example.com/users", config);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          credentials: "include",
        }),
      );
    });

    it("should override default timeout with request-specific timeout", async () => {
      httpHandler.configure({
        baseURL: "https://api.example.com",
        maxRetries: 3,
        defaultTimeout: 10000,
        withCredentials: true,
        defaultHeaders: {},
      });

      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const setTimeoutSpy = vi.spyOn(global, "setTimeout");

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        timeout: 2000,
      };

      await httpHandler.executeRequest("https://api.example.com/users", config);

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
    });
  });

  describe("status code handling", () => {
    it("should handle 3xx redirect responses", async () => {
      const redirectResponse = {
        ok: false,
        status: 301,
      } as Response;

      mockFetch.mockResolvedValue(redirectResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/old-resource",
        method: "GET",
      };

      const result = await httpHandler.executeRequest(
        "https://api.example.com/old-resource",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(redirectResponse);
    });

    it("should handle network status 0 as retryable", async () => {
      const networkErrorResponse = {
        ok: false,
        status: 0,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(networkErrorResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      vi.useFakeTimers();

      const resultPromise = httpHandler.executeRequest(
        "https://api.example.com/users",
        config,
      );
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      vi.useRealTimers();
    });
  });

  describe("fetch options forwarding", () => {
    it("should forward all fetch options", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch.mockResolvedValue(mockResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
        method: "POST",
        headers: {
          "X-Custom": "value",
          Authorization: "Bearer token",
        },
        mode: "cors" as RequestMode,
        cache: "no-cache" as RequestCache,
        redirect: "follow" as RequestRedirect,
        referrer: "no-referrer",
        integrity: "sha256-abcdef",
      };

      await httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/resource",
        expect.objectContaining({
          method: "POST",
          headers: {
            "X-Custom": "value",
            Authorization: "Bearer token",
          },
          mode: "cors",
          cache: "no-cache",
          redirect: "follow",
          referrer: "no-referrer",
          integrity: "sha256-abcdef",
        }),
      );
    });
  });

  describe("retry edge cases", () => {
    it("should handle undefined method as idempotent", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
      };

      vi.useFakeTimers();

      const resultPromise = httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      vi.useRealTimers();
    });

    it("should handle multiple consecutive errors before success", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 503,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse);

      httpHandler.configure({
        baseURL: "https://api.example.com",
        maxRetries: 3,
        defaultTimeout: 10000,
        withCredentials: true,
        defaultHeaders: {},
      });

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
        method: "GET",
      };

      vi.useFakeTimers();

      const resultPromise = httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toBe(successResponse);

      vi.useRealTimers();
    });

    it("should handle status 599 as server error", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 599,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
        method: "GET",
      };

      vi.useFakeTimers();

      const resultPromise = httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      vi.useRealTimers();
    });
  });

  describe("method case handling", () => {
    it("should handle lowercase method names", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
      } as Response;

      const successResponse = {
        ok: true,
        status: 200,
      } as Response;

      mockFetch
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(successResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
        method: "get",
      };

      vi.useFakeTimers();

      const resultPromise = httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toBe(successResponse);

      vi.useRealTimers();
    });

    it("should handle mixed case method names", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
      } as Response;

      mockFetch.mockResolvedValue(serverErrorResponse);

      const config: RequestConfig = {
        url: "https://api.example.com/resource",
        method: "Patch",
      };

      const result = await httpHandler.executeRequest(
        "https://api.example.com/resource",
        config,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBe(serverErrorResponse);
    });
  });
});
