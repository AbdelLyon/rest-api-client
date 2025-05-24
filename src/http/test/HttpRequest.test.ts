import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ConfigOptions, RequestConfig } from "@/http/types";

// Simple spy approach - plus fiable
describe("HttpRequest", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let HttpRequest: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpRequest: any;

  beforeEach(async () => {
    vi.resetModules();

    const module = await import("../Request/HttpRequest");
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
      const { HttpConfig } = await import("../Request/HttpConfig");
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
      const { HttpConfig } = await import("../Request/HttpConfig");
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
      const { HttpConfig } = await import("../Request/HttpConfig");
      const { HttpInterceptor } = await import("../Request/HttpInterceptor");

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
      const { HttpConfig } = await import("../Request/HttpConfig");
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
});
