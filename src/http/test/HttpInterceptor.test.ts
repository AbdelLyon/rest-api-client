import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  HttpConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseSuccessInterceptor,
  ResponseErrorInterceptor,
} from "@/http/types";
import { HttpInterceptor } from "../request/HttpInterceptor";

describe("HttpInterceptor", () => {
  const clearAllInterceptors = () => {
    HttpInterceptor["requestInterceptors"] = [];
    HttpInterceptor["responseSuccessInterceptors"] = [];
    HttpInterceptor["responseErrorInterceptors"] = [];
  };

  beforeEach(() => {
    clearAllInterceptors();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearAllInterceptors();
  });

  describe("addInterceptors", () => {
    it("should add request interceptors from config", () => {
      const requestInterceptor: RequestInterceptor = (config) => {
        return { ...config, headers: { ...config.headers, "X-Test": "true" } };
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [requestInterceptor],
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      expect(HttpInterceptor["requestInterceptors"]).toHaveLength(1);
      expect(HttpInterceptor["requestInterceptors"][0]).toBe(
        requestInterceptor,
      );
    });

    it("should add response success interceptors from config", () => {
      const successInterceptor: ResponseSuccessInterceptor = (response) =>
        response;

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            success: [successInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      expect(HttpInterceptor["responseSuccessInterceptors"]).toHaveLength(1);
      expect(HttpInterceptor["responseSuccessInterceptors"][0]).toBe(
        successInterceptor,
      );
    });

    it("should add response error interceptors from config", () => {
      const errorInterceptor: ResponseErrorInterceptor = (error) =>
        Promise.reject(error);

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      expect(HttpInterceptor["responseErrorInterceptors"]).toHaveLength(1);
      expect(HttpInterceptor["responseErrorInterceptors"][0]).toBe(
        errorInterceptor,
      );
    });

    it("should handle config without interceptors", () => {
      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
      };

      HttpInterceptor.addInterceptors(httpConfig);

      expect(HttpInterceptor["requestInterceptors"]).toHaveLength(0);
      expect(HttpInterceptor["responseSuccessInterceptors"]).toHaveLength(0);
      expect(HttpInterceptor["responseErrorInterceptors"]).toHaveLength(0);
    });

    it("should handle config with empty interceptors arrays", () => {
      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [],
          response: {
            success: [],
            error: [],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      expect(HttpInterceptor["requestInterceptors"]).toHaveLength(0);
      expect(HttpInterceptor["responseSuccessInterceptors"]).toHaveLength(0);
      expect(HttpInterceptor["responseErrorInterceptors"]).toHaveLength(0);
    });

    it("should accumulate interceptors from multiple configs", () => {
      const requestInterceptor1: RequestInterceptor = (config) => config;
      const requestInterceptor2: RequestInterceptor = (config) => config;

      const httpConfig1: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [requestInterceptor1],
        },
      };

      const httpConfig2: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [requestInterceptor2],
        },
      };

      HttpInterceptor.addInterceptors(httpConfig1);
      HttpInterceptor.addInterceptors(httpConfig2);

      expect(HttpInterceptor["requestInterceptors"]).toHaveLength(2);
      expect(HttpInterceptor["requestInterceptors"]).toContain(
        requestInterceptor1,
      );
      expect(HttpInterceptor["requestInterceptors"]).toContain(
        requestInterceptor2,
      );
    });
  });

  describe("applyRequestInterceptors", () => {
    it("should return original config when no interceptors", async () => {
      const originalConfig: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const result =
        await HttpInterceptor.applyRequestInterceptors(originalConfig);

      expect(result).toEqual(originalConfig);
      expect(result).not.toBe(originalConfig);
    });

    it("should apply single request interceptor", async () => {
      const requestInterceptor: RequestInterceptor = (config) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: "Bearer token",
          },
        };
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [requestInterceptor],
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalConfig: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const result =
        await HttpInterceptor.applyRequestInterceptors(originalConfig);

      expect(result.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      });
    });

    it("should apply multiple request interceptors in order", async () => {
      const interceptor1: RequestInterceptor = (config) => ({
        ...config,
        headers: { ...config.headers, "X-First": "true" },
      });

      const interceptor2: RequestInterceptor = (config) => ({
        ...config,
        headers: { ...config.headers, "X-Second": "true" },
      });

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [interceptor1, interceptor2],
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalConfig: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      const result =
        await HttpInterceptor.applyRequestInterceptors(originalConfig);

      expect(result.headers).toEqual({
        "Content-Type": "application/json",
        "X-First": "true",
        "X-Second": "true",
      });
    });

    it("should handle async request interceptors", async () => {
      const asyncInterceptor: RequestInterceptor = async (config) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          ...config,
          headers: { ...config.headers, "X-Async": "true" },
        };
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [asyncInterceptor],
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalConfig: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const result =
        await HttpInterceptor.applyRequestInterceptors(originalConfig);

      expect(result.headers).toEqual({ "X-Async": "true" });
    });
  });

  describe("applyResponseSuccessInterceptors", () => {
    it("should return original response when no interceptors", async () => {
      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result =
        await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it("should apply single response success interceptor", async () => {
      const successInterceptor: ResponseSuccessInterceptor = (response) => {
        const modifiedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers),
            "X-Intercepted": "true",
          },
        });
        return modifiedResponse;
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            success: [successInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result =
        await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

      expect(result.headers.get("X-Intercepted")).toBe("true");
    });

    it("should apply multiple response success interceptors", async () => {
      const interceptor1: ResponseSuccessInterceptor = (response) => {
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            "X-First": "true",
          },
        });
      };

      const interceptor2: ResponseSuccessInterceptor = (response) => {
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            "X-Second": "true",
          },
        });
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            success: [interceptor1, interceptor2],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const mockResponse = new Response('{"data": "test"}', {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      const result =
        await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

      expect(result.headers.get("X-First")).toBe("true");
      expect(result.headers.get("X-Second")).toBe("true");
    });

    it("should clone response for each interceptor", async () => {
      const cloneSpy = vi.fn();
      const mockResponse = {
        clone: cloneSpy.mockReturnThis(),
      } as unknown as Response;

      const interceptor: ResponseSuccessInterceptor = (response) => response;

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            success: [interceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

      expect(cloneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("applyResponseErrorInterceptors", () => {
    it("should reject with original error when no interceptors", async () => {
      const originalError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(originalError),
      ).rejects.toThrow("Test error");
    });

    it("should apply single error interceptor", async () => {
      const errorInterceptor: ResponseErrorInterceptor = (error) => {
        const modifiedError = new Error(`Intercepted: ${error.message}`);
        return Promise.reject(modifiedError);
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(originalError),
      ).rejects.toThrow("Intercepted: Test error");
    });

    it("should apply multiple error interceptors in order", async () => {
      const interceptor1: ResponseErrorInterceptor = (error) => {
        return Promise.reject(new Error(`First: ${error.message}`));
      };

      const interceptor2: ResponseErrorInterceptor = (error) => {
        return Promise.reject(new Error(`Second: ${error.message}`));
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [interceptor1, interceptor2],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(originalError),
      ).rejects.toThrow("Second: First: Test error");
    });

    it("should handle interceptor that returns non-Error", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorInterceptor = async (): Promise<any> => {
        return await "Not an error";
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalError = new Error("Test error");

      const result =
        await HttpInterceptor.applyResponseErrorInterceptors(originalError);

      expect(result).toBe("Not an error");
    });

    it("should handle interceptor that throws", async () => {
      const errorInterceptor: ResponseErrorInterceptor = () => {
        throw new Error("Interceptor error");
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(originalError),
      ).rejects.toThrow("Interceptor error");
    });

    it("should handle interceptor that throws non-Error", async () => {
      const errorInterceptor: ResponseErrorInterceptor = () => {
        throw "String error";
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const originalError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(originalError),
      ).rejects.toThrow("Unknown error occurred");
    });
  });

  describe("setupDefaultErrorInterceptor", () => {
    it("should add default error interceptor when none exist", () => {
      const logCallback = vi.fn();

      HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

      expect(HttpInterceptor["responseErrorInterceptors"]).toHaveLength(1);
    });

    it("should not add default error interceptor when one already exists", () => {
      const existingInterceptor: ResponseErrorInterceptor = (error) =>
        Promise.reject(error);

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          response: {
            error: [existingInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      const logCallback = vi.fn();
      HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

      expect(HttpInterceptor["responseErrorInterceptors"]).toHaveLength(1);
      expect(HttpInterceptor["responseErrorInterceptors"][0]).toBe(
        existingInterceptor,
      );
    });

    it("should call log callback and reject error", async () => {
      const logCallback = vi.fn();
      HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

      const testError = new Error("Test error");

      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(testError),
      ).rejects.toThrow("Test error");

      expect(logCallback).toHaveBeenCalledWith(testError);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete interceptor chain", async () => {
      const requestInterceptor: RequestInterceptor = (config) => ({
        ...config,
        headers: { ...config.headers, Authorization: "Bearer token" },
      });

      const successInterceptor: ResponseSuccessInterceptor = (response) => {
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            "X-Success": "true",
          },
        });
      };

      const errorInterceptor: ResponseErrorInterceptor = (error) => {
        return Promise.resolve(new Error(`Handled: ${error.message}`));
      };

      const httpConfig: HttpConfig = {
        baseURL: "https://api.example.com",
        interceptors: {
          request: [requestInterceptor],
          response: {
            success: [successInterceptor],
            error: [errorInterceptor],
          },
        },
      };

      HttpInterceptor.addInterceptors(httpConfig);

      // Test request interceptor
      const requestConfig: RequestConfig = {
        url: "https://api.example.com/users",
        method: "GET",
      };

      const interceptedRequest =
        await HttpInterceptor.applyRequestInterceptors(requestConfig);
      expect(interceptedRequest.headers?.["Authorization"]).toBe(
        "Bearer token",
      );

      const mockResponse = new Response('{"data": "test"}', { status: 200 });
      const interceptedResponse =
        await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);
      expect(interceptedResponse.headers.get("X-Success")).toBe("true");

      const testError = new Error("API Error");
      await expect(
        HttpInterceptor.applyResponseErrorInterceptors(testError),
      ).rejects.toThrow("Handled: API Error");
    });
  });
});
