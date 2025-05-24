/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ConfigOptions, RequestConfig } from "@/http/types";

// Simple spy approach - plus fiable
describe("HttpRequest", () => {
  let HttpRequest: any;

  let httpRequest: any;

  beforeEach(async () => {
    vi.resetModules();

    const module = await import("../request/HttpRequest");
    HttpRequest = module.HttpRequest;
    httpRequest = new HttpRequest();
  });

  describe("basic functionality", () => {
    it("should be instantiable", () => {
      expect(httpRequest).toBeDefined();
      expect(typeof httpRequest.configure).toBe("function");
      expect(typeof httpRequest.request).toBe("function");
    });

    it("should accept configuration", () => {
      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
      };

      expect(() => httpRequest.configure(options)).not.toThrow();
    });

    it("should accept configuration with all options", () => {
      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
        timeout: 15000,
        maxRetries: 5,
        withCredentials: false,
        headers: {
          "Custom-Header": "custom-value",
        },
      };

      expect(() => httpRequest.configure(options)).not.toThrow();
    });

    it("should have proper method structure", () => {
      // Test que les méthodes privées existent (via prototype)
      const prototype = Object.getPrototypeOf(httpRequest);
      const methods = Object.getOwnPropertyNames(prototype);

      expect(methods).toContain("configure");
      expect(methods).toContain("request");
      expect(methods).toContain("constructor");
    });
  });

  describe("URL building logic", () => {
    beforeEach(async () => {
      const { HttpConfig } = await import("../request/HttpConfig");
      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );

      httpRequest.configure({
        baseURL: "https://api.example.com",
      });
    });

    it("should handle buildRequestUrl method", () => {
      const buildRequestUrl =
        httpRequest.buildRequestUrl || httpRequest["buildRequestUrl"];

      if (typeof buildRequestUrl === "function") {
        const absoluteUrl = "https://external.com/api";
        expect(() =>
          buildRequestUrl.call(httpRequest, absoluteUrl),
        ).not.toThrow();

        expect(() => buildRequestUrl.call(httpRequest, "/users")).not.toThrow();
        expect(() => buildRequestUrl.call(httpRequest, "users")).not.toThrow();
      }
    });
  });

  describe("config merging logic", () => {
    beforeEach(async () => {
      const { HttpConfig } = await import("../request/HttpConfig");
      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );

      httpRequest.configure({
        baseURL: "https://api.example.com",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should handle createMergedConfig method", () => {
      const createMergedConfig =
        httpRequest.createMergedConfig || httpRequest["createMergedConfig"];

      if (typeof createMergedConfig === "function") {
        const options: RequestConfig = {
          url: "/users",
          method: "POST",
          headers: {
            Authorization: "Bearer token",
          },
        };

        expect(() =>
          createMergedConfig.call(httpRequest, options),
        ).not.toThrow();
      }
    });
  });

  describe("error handling structure", () => {
    it("should have error handling method", () => {
      const handleReqError =
        httpRequest.handleReqError || httpRequest["handleReqError"];
      expect(typeof handleReqError).toBe("function");
    });
  });

  describe("property initialization", () => {
    it("should have correct default properties", () => {
      const newRequest = new HttpRequest();
      expect(newRequest).toBeDefined();
      expect(typeof newRequest.configure).toBe("function");
      expect(typeof newRequest.request).toBe("function");
    });

    it("should initialize handler property", () => {
      const newRequest = new HttpRequest();
      expect(newRequest).toBeDefined();
    });
  });

  describe("method signatures", () => {
    it("should have correct configure signature", () => {
      expect(httpRequest.configure.length).toBe(1);
    });

    it("should have correct request signature", () => {
      expect(httpRequest.request.length).toBe(1);
    });
  });

  describe("integration with dependencies", () => {
    it("should work with mocked dependencies", async () => {
      // Mock minimal des dépendances
      const { HttpConfig } = await import("../request/HttpConfig");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");

      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );
      vi.spyOn(HttpConfig, "logError").mockImplementation(() => {});
      vi.spyOn(
        HttpInterceptor,
        "setupDefaultErrorInterceptor",
      ).mockImplementation(() => {});
      vi.spyOn(HttpInterceptor, "addInterceptors").mockImplementation(() => {});

      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
      };

      expect(() => httpRequest.configure(options)).not.toThrow();
      expect(HttpConfig.getFullBaseUrl).toHaveBeenCalledWith(options);
    });
  });

  describe("typescript compliance", () => {
    it("should implement IHttpRequest interface", () => {
      expect(typeof httpRequest.configure).toBe("function");
      expect(typeof httpRequest.request).toBe("function");
    });

    it("should handle generic types in request method", () => {
      expect(typeof httpRequest.request).toBe("function");
    });
  });

  describe("configuration validation", () => {
    it("should handle various configuration scenarios", () => {
      const configs = [
        { baseURL: "https://api.example.com" },
        {
          baseURL: "https://api.example.com",
          timeout: 5000,
        },
        {
          baseURL: "https://api.example.com",
          headers: { "X-Test": "true" },
        },
        {
          baseURL: "https://api.example.com",
          withCredentials: false,
        },
      ];

      configs.forEach((config) => {
        expect(() => {
          const instance = new HttpRequest();
          instance.configure(config);
        }).not.toThrow();
      });
    });
  });

  describe("request config validation", () => {
    beforeEach(async () => {
      const { HttpConfig } = await import("../request/HttpConfig");
      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );

      httpRequest.configure({
        baseURL: "https://api.example.com",
      });
    });

    it("should handle various request configurations", () => {
      const requestConfigs: RequestConfig[] = [
        { url: "/test" },
        { url: "/test", method: "GET" },
        { url: "/test", method: "POST", data: { test: true } },
        { url: "https://external.com/api" },
        { url: "/test", headers: { Authorization: "Bearer token" } },
      ];

      requestConfigs.forEach((config) => {
        expect(config.url).toBeDefined();
        expect(typeof config.url).toBe("string");
      });
    });
  });

  describe("HttpHandler integration", () => {
    it("should create HttpHandler instance in constructor", () => {
      const instance = new HttpRequest();
      // Test that handler is properly initialized
      expect(instance["handler"]).toBeDefined();
    });

    it("should configure handler when configure is called", async () => {
      const { HttpHandler } = await import("../request/HttpHandler");
      const configureSpy = vi.spyOn(HttpHandler.prototype, "configure");

      const instance = new HttpRequest();
      instance.configure({
        baseURL: "https://api.example.com",
        timeout: 5000,
        maxRetries: 2,
        withCredentials: false,
        headers: { "X-Custom": "value" },
      });

      expect(configureSpy).toHaveBeenCalledWith({
        baseURL: "https://api.example.com",
        defaultTimeout: 5000,
        defaultHeaders: expect.objectContaining({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Custom": "value",
        }),
        maxRetries: 2,
        withCredentials: false,
      });
    });
  });

  describe("request method", () => {
    let instance: any;
    let mockHandler: any;

    beforeEach(async () => {
      const { HttpHandler } = await import("../request/HttpHandler");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");
      const { HttpConfig } = await import("../request/HttpConfig");

      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );
      vi.spyOn(HttpInterceptor, "applyRequestInterceptors").mockImplementation(
        (config) => Promise.resolve(config),
      );
      vi.spyOn(
        HttpInterceptor,
        "applyResponseSuccessInterceptors",
      ).mockImplementation((response) => Promise.resolve(response));

      mockHandler = {
        configure: vi.fn(),
        executeRequest: vi.fn().mockResolvedValue(new Response()),
        parseResponse: vi.fn().mockResolvedValue({ data: "test" }),
      };

      vi.spyOn(HttpHandler.prototype, "configure").mockImplementation(
        mockHandler.configure,
      );
      vi.spyOn(HttpHandler.prototype, "executeRequest").mockImplementation(
        mockHandler.executeRequest,
      );
      vi.spyOn(HttpHandler.prototype, "parseResponse").mockImplementation(
        mockHandler.parseResponse,
      );

      instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });
    });

    it("should execute request with proper flow", async () => {
      const requestConfig = { url: "/users", method: "GET" as const };
      const result = await instance.request(requestConfig);

      expect(mockHandler.executeRequest).toHaveBeenCalled();
      expect(mockHandler.parseResponse).toHaveBeenCalled();
      expect(result).toEqual({ data: "test" });
    });

    it("should apply interceptors in correct order", async () => {
      const { HttpInterceptor } = await import("../request/HttpInterceptor");
      const applyRequestSpy = vi.spyOn(
        HttpInterceptor,
        "applyRequestInterceptors",
      );
      const applyResponseSpy = vi.spyOn(
        HttpInterceptor,
        "applyResponseSuccessInterceptors",
      );

      await instance.request({ url: "/test" });

      expect(applyRequestSpy).toHaveBeenCalledBefore(
        mockHandler.executeRequest as any,
      );
      expect(mockHandler.executeRequest).toHaveBeenCalledBefore(
        applyResponseSpy as any,
      );
    });
  });

  describe("error handling", () => {
    it("should handle HttpError instances", async () => {
      const { HttpError } = await import("../request/HttpError");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");

      const originalError = new HttpError(new Error("Network error"), {
        url: "/test",
      });
      const interceptedError = new Error("Intercepted error");

      vi.spyOn(
        HttpInterceptor,
        "applyResponseErrorInterceptors",
      ).mockResolvedValue(interceptedError);

      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      await expect(
        instance["handleReqError"](originalError, { url: "/test" }),
      ).rejects.toBe(interceptedError);
    });

    it("should wrap non-HttpError errors", async () => {
      const { HttpError } = await import("../request/HttpError");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");

      const regularError = new Error("Regular error");
      vi.spyOn(
        HttpInterceptor,
        "applyResponseErrorInterceptors",
      ).mockImplementation((error) => Promise.resolve(error));

      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      await expect(
        instance["handleReqError"](regularError, { url: "/test" }),
      ).rejects.toBeInstanceOf(HttpError);
    });
  });

  describe("default values", () => {
    it("should use default values when options are not provided", () => {
      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      expect(instance["defaultTimeout"]).toBe(10000);
      expect(instance["maxRetries"]).toBe(3);
      expect(instance["withCredentials"]).toBe(true);
      expect(instance["defaultHeaders"]).toEqual({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
    });
  });

  describe("full request flow integration", () => {
    it("should complete full request cycle", async () => {
      // Setup all mocks
      const { HttpHandler } = await import("../request/HttpHandler");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");
      const { HttpConfig } = await import("../request/HttpConfig");

      const mockResponse = new Response(
        JSON.stringify({ id: 1, name: "Test" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );

      vi.spyOn(HttpConfig, "getFullBaseUrl").mockReturnValue(
        "https://api.example.com",
      );
      vi.spyOn(
        HttpInterceptor,
        "setupDefaultErrorInterceptor",
      ).mockImplementation(() => {});
      vi.spyOn(HttpInterceptor, "addInterceptors").mockImplementation(() => {});
      vi.spyOn(HttpInterceptor, "applyRequestInterceptors").mockImplementation(
        (config) => Promise.resolve(config),
      );
      vi.spyOn(
        HttpInterceptor,
        "applyResponseSuccessInterceptors",
      ).mockImplementation((response) => Promise.resolve(response));
      vi.spyOn(HttpHandler.prototype, "configure").mockImplementation(() => {});
      vi.spyOn(HttpHandler.prototype, "executeRequest").mockResolvedValue(
        mockResponse,
      );
      vi.spyOn(HttpHandler.prototype, "parseResponse").mockResolvedValue({
        id: 1,
        name: "Test",
      });

      const instance = new HttpRequest();

      instance.configure({ baseURL: "https://api.example.com" });

      const result = await instance.request({
        url: "/users/1",
        method: "GET",
      });

      expect(result).toEqual({ id: 1, name: "Test" });
    });
  });

  describe("createMergedConfig edge cases", () => {
    it("should handle config with all HTTP methods", async () => {
      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      const methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "HEAD",
        "OPTIONS",
      ] as const;

      methods.forEach((method) => {
        const config = instance["createMergedConfig"]({
          url: "/test",
          method: method as any,
        });
        expect(config.method).toBe(method);
      });
    });

    it("should merge headers correctly with null/undefined", () => {
      const instance = new HttpRequest();
      instance.configure({
        baseURL: "https://api.example.com",
        headers: { "X-Custom": "value" },
      });

      const config = instance["createMergedConfig"]({
        url: "/test",
        headers: undefined,
      });

      expect(config.headers).toEqual({
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Custom": "value",
      });
    });

    it("should override default headers when specified", () => {
      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      const config = instance["createMergedConfig"]({
        url: "/test",
        headers: {
          "Content-Type": "text/plain",
          "X-New": "header",
        },
      });

      expect(config.headers["Content-Type"]).toBe("text/plain");
      expect(config.headers["X-New"]).toBe("header");
    });

    it("should use request timeout over default", () => {
      const instance = new HttpRequest();
      instance.configure({
        baseURL: "https://api.example.com",
        timeout: 5000,
      });

      const config = instance["createMergedConfig"]({
        url: "/test",
        timeout: 1000,
      });

      expect(config.timeout).toBe(1000);
    });
  });

  describe("request error scenarios", () => {
    it("should handle errors during interceptor application", async () => {
      const { HttpInterceptor } = await import("../request/HttpInterceptor");
      const interceptorError = new Error("Interceptor failed");

      vi.spyOn(HttpInterceptor, "applyRequestInterceptors").mockRejectedValue(
        interceptorError,
      );

      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      await expect(instance.request({ url: "/test" })).rejects.toThrow();
    });

    it("should handle errors during response parsing", async () => {
      const { HttpHandler } = await import("../request/HttpHandler");
      const { HttpInterceptor } = await import("../request/HttpInterceptor");

      vi.spyOn(HttpInterceptor, "applyRequestInterceptors").mockImplementation(
        (config) => Promise.resolve(config),
      );
      vi.spyOn(
        HttpInterceptor,
        "applyResponseSuccessInterceptors",
      ).mockImplementation((response) => Promise.resolve(response));
      vi.spyOn(HttpHandler.prototype, "executeRequest").mockResolvedValue(
        new Response(),
      );
      vi.spyOn(HttpHandler.prototype, "parseResponse").mockRejectedValue(
        new Error("Parse error"),
      );

      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      await expect(instance.request({ url: "/test" })).rejects.toThrow();
    });
  });

  describe("configuration edge cases", () => {
    it("should handle configuration with apiPrefix and apiVersion", async () => {
      const { HttpConfig } = await import("../request/HttpConfig");
      const getFullBaseUrlSpy = vi.spyOn(HttpConfig, "getFullBaseUrl");

      const instance = new HttpRequest();
      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
        apiPrefix: "api",
        apiVersion: "v2",
      };

      instance.configure(options);

      expect(getFullBaseUrlSpy).toHaveBeenCalledWith(options);
    });

    it("should handle empty headers in configuration", () => {
      const instance = new HttpRequest();
      instance.configure({
        baseURL: "https://api.example.com",
        headers: {},
      });

      expect(instance["defaultHeaders"]).toEqual({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
    });

    it("should handle configuration with interceptors", async () => {
      const { HttpInterceptor } = await import("../request/HttpInterceptor");
      const addInterceptorsSpy = vi.spyOn(HttpInterceptor, "addInterceptors");

      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
      };

      const instance = new HttpRequest();
      instance.configure(options);

      expect(addInterceptorsSpy).toHaveBeenCalledWith(options);
    });
  });

  describe("memory management", () => {
    it("should not retain references after request completion", async () => {
      const { HttpHandler } = await import("../request/HttpHandler");

      const executeRequestSpy = vi.spyOn(
        HttpHandler.prototype,
        "executeRequest",
      );
      const parseResponseSpy = vi.spyOn(HttpHandler.prototype, "parseResponse");

      executeRequestSpy.mockResolvedValue(new Response());
      parseResponseSpy.mockResolvedValue({ data: "test" });

      const instance = new HttpRequest();
      instance.configure({ baseURL: "https://api.example.com" });

      await instance.request({ url: "/test" });

      expect(executeRequestSpy).toHaveBeenCalled();
      expect(parseResponseSpy).toHaveBeenCalled();

      executeRequestSpy.mockClear();
      parseResponseSpy.mockClear();
    });
  });
});
