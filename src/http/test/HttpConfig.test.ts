import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ConfigOptions } from "@/http/types";
import { HttpConfig } from "../request/HttpConfig";

interface ApiError extends Error {
  config?: {
    url?: string;
    method?: string;
  };
  status?: number;
  data?: unknown;
}

const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("HttpConfig", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getFullBaseUrl", () => {
    it("should throw an error when baseURL is not provided", () => {
      const options = {} as ConfigOptions;

      expect(() => HttpConfig.getFullBaseUrl(options)).toThrow(
        "baseURL is required in HttpConfigOptions",
      );
    });

    it("should throw an error when baseURL is empty string", () => {
      const options: ConfigOptions = {
        baseURL: "",
      };

      expect(() => HttpConfig.getFullBaseUrl(options)).toThrow(
        "baseURL is required in HttpConfigOptions",
      );
    });

    it("should return trimmed baseURL when baseURL is only whitespace", () => {
      const options: ConfigOptions = {
        baseURL: "   ",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("");
    });

    it("should return baseURL when no prefix or version is provided", () => {
      const options: ConfigOptions = {
        baseURL: "https://api.example.com",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("https://api.example.com");
    });

    it("should remove trailing slash from baseURL", () => {
      const options: ConfigOptions = {
        baseURL: "https://api.example.com/",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("https://api.example.com");
    });

    it("should remove multiple trailing slashes from baseURL", () => {
      const options: ConfigOptions = {
        baseURL: "https://api.example.com///",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("https://api.example.com//");
    });

    it("should trim whitespace from baseURL", () => {
      const options: ConfigOptions = {
        baseURL: "  https://api.example.com  ",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("https://api.example.com");
    });

    it("should handle baseURL with whitespace and trailing slash", () => {
      const options: ConfigOptions = {
        baseURL: "  https://api.example.com/  ",
      };

      const result = HttpConfig.getFullBaseUrl(options);

      expect(result).toBe("https://api.example.com");
    });

    describe("apiPrefix handling", () => {
      it("should append apiPrefix when provided", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "api",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should handle apiPrefix with leading slash", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "/api",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should add leading slash to apiPrefix when missing", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "api/v1",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api/v1");
      });

      it("should remove trailing slash from apiPrefix", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "api/",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should remove multiple trailing slashes from apiPrefix", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "api///",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api//");
      });

      it("should trim whitespace from apiPrefix", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "  api  ",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should handle apiPrefix with whitespace and slashes", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "  /api/  ",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should handle complex apiPrefix with multiple segments", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "/api/v2/public",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api/v2/public");
      });

      it("should handle empty apiPrefix", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com");
      });

      it("should handle apiPrefix with only whitespace (returns base URL)", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "   ",
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com");
      });
    });

    describe("apiVersion handling", () => {
      it("should append apiVersion when provided", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiVersion: 1,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/v1");
      });

      it("should handle apiVersion with different numbers", () => {
        const testCases = [1, 2, 10, 99];

        testCases.forEach((version) => {
          const options: ConfigOptions = {
            baseURL: "https://api.example.com",
            apiVersion: version,
          };

          const result = HttpConfig.getFullBaseUrl(options);

          expect(result).toBe(`https://api.example.com/v${version}`);
        });
      });

      it("should not process apiVersion when it is 0 (falsy)", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiVersion: 0,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com");
      });
    });

    describe("priority handling", () => {
      it("should prioritize apiPrefix over apiVersion when both are provided", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "api",
          apiVersion: 1,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/api");
      });

      it("should prioritize non-empty apiPrefix over apiVersion", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "/v2/custom",
          apiVersion: 1,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/v2/custom");
      });

      it("should fall back to apiVersion when apiPrefix is empty", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "",
          apiVersion: 3,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com/v3");
      });

      it("should handle apiPrefix with whitespace (not fall back to apiVersion)", () => {
        const options: ConfigOptions = {
          baseURL: "https://api.example.com",
          apiPrefix: "   ",
          apiVersion: 2,
        };

        const result = HttpConfig.getFullBaseUrl(options);

        expect(result).toBe("https://api.example.com");
      });
    });
  });

  describe("logError", () => {
    it("should log error details to console", () => {
      const error: ApiError = {
        name: "ApiError",
        message: "Request failed",
        config: {
          url: "https://api.example.com/users",
          method: "GET",
        },
        status: 404,
        data: { error: "Not found" },
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: "https://api.example.com/users",
        method: "GET",
        status: 404,
        data: { error: "Not found" },
        message: "Request failed",
      });
    });

    it("should handle error without config", () => {
      const error: ApiError = {
        name: "ApiError",
        message: "Network error",
        status: 500,
        data: null,
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: undefined,
        method: undefined,
        status: 500,
        data: null,
        message: "Network error",
      });
    });

    it("should handle error with partial config", () => {
      const error: ApiError = {
        name: "ApiError",
        message: "Timeout error",
        config: {
          url: "https://api.example.com/posts",
        },
        status: 408,
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: "https://api.example.com/posts",
        method: undefined,
        status: 408,
        data: undefined,
        message: "Timeout error",
      });
    });

    it("should handle error with empty config", () => {
      const error: ApiError = {
        name: "ApiError",
        message: "Unknown error",
        config: {},
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: undefined,
        method: undefined,
        status: undefined,
        data: undefined,
        message: "Unknown error",
      });
    });

    it("should handle minimal error object", () => {
      const error: ApiError = {
        name: "ApiError",
        message: "Unknown error",
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: undefined,
        method: undefined,
        status: undefined,
        data: undefined,
        message: "Unknown error",
      });
    });

    it("should handle error with complex data", () => {
      const error: ApiError = {
        name: "ValidationError",
        message: "Validation failed",
        config: {
          url: "https://api.example.com/users",
          method: "POST",
        },
        status: 422,
        data: {
          errors: {
            email: ["Email is required", "Email must be valid"],
            password: ["Password is too short"],
          },
          code: "VALIDATION_ERROR",
        },
      };

      HttpConfig.logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
        url: "https://api.example.com/users",
        method: "POST",
        status: 422,
        data: {
          errors: {
            email: ["Email is required", "Email must be valid"],
            password: ["Password is too short"],
          },
          code: "VALIDATION_ERROR",
        },
        message: "Validation failed",
      });
    });

    it("should handle error with different HTTP methods", () => {
      const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

      methods.forEach((method) => {
        consoleSpy.mockClear();

        const error: ApiError = {
          name: "ApiError",
          message: `${method} request failed`,
          config: {
            url: "https://api.example.com/resource",
            method,
          },
          status: 400,
        };

        HttpConfig.logError(error);

        expect(consoleSpy).toHaveBeenCalledWith("API Request Error:", {
          url: "https://api.example.com/resource",
          method,
          status: 400,
          data: undefined,
          message: `${method} request failed`,
        });
      });
    });
  });
});
