import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { HandlerConfig, RequestConfig } from "@/http/types";
import { HttpHandler } from "../Request/HttpHandler";

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
});
