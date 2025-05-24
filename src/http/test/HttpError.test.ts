import { describe, it, expect, beforeEach } from "vitest";
import type { ApiErrorSource, RequestConfig } from "@/http/types";
import { HttpError } from "../Request/HttpError";

interface MockRequestConfig extends RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

interface MockApiErrorSource extends ApiErrorSource {
  status?: number;
  statusText?: string;
  data?: unknown;
  response?: Response;
}

describe("HttpError", () => {
  let mockRequestConfig: MockRequestConfig;

  beforeEach(() => {
    mockRequestConfig = {
      url: "https://api.example.com/users",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
  });

  describe("constructor", () => {
    it("should create HttpError with Error instance", () => {
      const originalError = new Error("Network timeout");
      const httpError = new HttpError(originalError, mockRequestConfig);

      expect(httpError.name).toBe("ApiRequestError");
      expect(httpError.message).toBe("Network timeout");
      expect(httpError.originalError).toBe(originalError);
      expect(httpError.requestConfig).toBe(mockRequestConfig);
    });

    it("should create HttpError with non-Error object", () => {
      const originalError = "String error";
      const httpError = new HttpError(originalError, mockRequestConfig);

      expect(httpError.name).toBe("ApiRequestError");
      expect(httpError.message).toBe("API Service Request Failed");
      expect(httpError.originalError).toBe(originalError);
      expect(httpError.requestConfig).toBe(mockRequestConfig);
    });

    it("should create HttpError with null error", () => {
      const httpError = new HttpError(null, mockRequestConfig);

      expect(httpError.name).toBe("ApiRequestError");
      expect(httpError.message).toBe("API Service Request Failed");
      expect(httpError.originalError).toBe(null);
      expect(httpError.requestConfig).toBe(mockRequestConfig);
    });

    it("should create HttpError with undefined error", () => {
      const httpError = new HttpError(undefined, mockRequestConfig);

      expect(httpError.name).toBe("ApiRequestError");
      expect(httpError.message).toBe("API Service Request Failed");
      expect(httpError.originalError).toBe(undefined);
      expect(httpError.requestConfig).toBe(mockRequestConfig);
    });
  });

  describe("extractErrorDetails", () => {
    it("should extract status, statusText and data from error object", () => {
      const errorSource: MockApiErrorSource = {
        status: 404,
        statusText: "Not Found",
        data: { message: "User not found" },
      };

      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.status).toBe(404);
      expect(httpError.statusText).toBe("Not Found");
      expect(httpError.data).toEqual({ message: "User not found" });
    });

    it("should extract details from Response object", () => {
      // Créer une vraie instance de Response
      const mockResponse = new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      });

      const errorSource: MockApiErrorSource = {
        response: mockResponse,
        status: 400,
        statusText: "Bad Request",
      };

      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.status).toBe(500);
      expect(httpError.statusText).toBe("Internal Server Error");
    });

    it("should handle error without response details", () => {
      const errorSource = {};
      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.status).toBeUndefined();
      expect(httpError.statusText).toBeUndefined();
      expect(httpError.data).toBeUndefined();
    });

    it("should handle primitive error values", () => {
      const httpError = new HttpError("string error", mockRequestConfig);

      expect(httpError.status).toBeUndefined();
      expect(httpError.statusText).toBeUndefined();
      expect(httpError.data).toBeUndefined();
    });

    it("should handle partial error details", () => {
      const errorSource: MockApiErrorSource = {
        status: 403,
      };

      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.status).toBe(403);
      expect(httpError.statusText).toBeUndefined();
      expect(httpError.data).toBeUndefined();
    });
  });

  describe("getErrorType", () => {
    it('should return "network" when status is undefined', () => {
      const httpError = new HttpError(
        new Error("Network error"),
        mockRequestConfig,
      );

      expect(httpError.getErrorType()).toBe("network");
    });

    it('should return "network" when status is 0', () => {
      const errorSource: MockApiErrorSource = { status: 0 };
      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.getErrorType()).toBe("network");
    });

    it('should return "client" for 4xx status codes', () => {
      const testCases = [400, 401, 403, 404, 422, 499];

      testCases.forEach((status) => {
        const errorSource: MockApiErrorSource = { status };
        const httpError = new HttpError(errorSource, mockRequestConfig);

        expect(httpError.getErrorType()).toBe("client");
      });
    });

    it('should return "server" for 5xx status codes', () => {
      const testCases = [500, 501, 502, 503, 504, 599];

      testCases.forEach((status) => {
        const errorSource: MockApiErrorSource = { status };
        const httpError = new HttpError(errorSource, mockRequestConfig);

        expect(httpError.getErrorType()).toBe("server");
      });
    });

    it('should return "unknown" for other status codes', () => {
      const testCases = [100, 200, 300, 350, 399];

      testCases.forEach((status) => {
        const errorSource: MockApiErrorSource = { status };
        const httpError = new HttpError(errorSource, mockRequestConfig);

        expect(httpError.getErrorType()).toBe("unknown");
      });
    });
  });

  describe("hasStatus", () => {
    it("should return true when status matches", () => {
      const errorSource: MockApiErrorSource = { status: 404 };
      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.hasStatus(404)).toBe(true);
    });

    it("should return false when status does not match", () => {
      const errorSource: MockApiErrorSource = { status: 404 };
      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.hasStatus(500)).toBe(false);
    });

    it("should return false when status is undefined", () => {
      const httpError = new HttpError(
        new Error("Network error"),
        mockRequestConfig,
      );

      expect(httpError.hasStatus(404)).toBe(false);
    });

    it("should handle edge cases", () => {
      const errorSource: MockApiErrorSource = { status: 0 };
      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.hasStatus(0)).toBe(true);
      expect(httpError.hasStatus(404)).toBe(false);
    });
  });

  describe("error inheritance", () => {
    it("should be an instance of Error", () => {
      const httpError = new HttpError(new Error("Test"), mockRequestConfig);

      expect(httpError).toBeInstanceOf(Error);
      expect(httpError).toBeInstanceOf(HttpError);
    });

    it("should have correct prototype chain", () => {
      const httpError = new HttpError(new Error("Test"), mockRequestConfig);

      expect(httpError.name).toBe("ApiRequestError");
      expect(httpError.constructor).toBe(HttpError);
    });
  });

  describe("integration scenarios", () => {
    it("should handle fetch API error simulation", () => {
      const mockResponse = new Response(null, {
        status: 422,
        statusText: "Unprocessable Entity",
      });

      const fetchError = {
        message: "Validation failed",
        response: mockResponse,
        data: {
          errors: {
            email: ["Email is required"],
          },
        },
      };

      const httpError = new HttpError(fetchError, mockRequestConfig);

      expect(httpError.status).toBe(422);
      expect(httpError.statusText).toBe("Unprocessable Entity");
      expect(httpError.data).toEqual({
        errors: {
          email: ["Email is required"],
        },
      });
      expect(httpError.getErrorType()).toBe("client");
      expect(httpError.hasStatus(422)).toBe(true);
    });

    it("should handle axios-like error structure", () => {
      const axiosLikeError = {
        message: "Request failed with status code 500",
        status: 500,
        statusText: "Internal Server Error",
        data: { error: "Database connection failed" },
      };

      const httpError = new HttpError(axiosLikeError, mockRequestConfig);

      expect(httpError.message).toBe("API Service Request Failed");
      expect(httpError.status).toBe(500);
      expect(httpError.statusText).toBe("Internal Server Error");
      expect(httpError.data).toEqual({ error: "Database connection failed" });
      expect(httpError.getErrorType()).toBe("server");
    });

    it("should handle error with mock response object (non-Response instance)", () => {
      const mockResponseLike = {
        status: 401,
        statusText: "Unauthorized",
      };

      const errorSource = {
        status: 400,
        statusText: "Bad Request",
        response: mockResponseLike,
      };

      const httpError = new HttpError(errorSource, mockRequestConfig);

      expect(httpError.status).toBe(400);
      expect(httpError.statusText).toBe("Bad Request");
    });
  });
});
