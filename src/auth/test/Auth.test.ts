/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "@/http/HttpClient";
import { z } from "zod";
import { Auth } from "../Auth";

vi.mock("@/http/HttpClient", () => {
  const mockRequest = vi.fn();
  return {
    HttpClient: {
      getInstance: vi.fn().mockReturnValue({
        request: mockRequest,
      }),
    },
  };
});

type TestUser = {
  id: string;
  email: string;
  name: string;
};

type TestCredentials = {
  email: string;
  password: string;
};

type TestRegisterData = {
  email: string;
  password: string;
  name: string;
};

type TestTokens = {
  accessToken: string;
  refreshToken: string;
};

class TestAuth extends Auth<
  TestUser,
  TestCredentials,
  TestRegisterData,
  TestTokens
> {
  constructor() {
    const userSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
    });

    const credentialsSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const registerDataSchema = z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    });

    const tokenSchema = z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    });

    super("/auth", {
      user: userSchema,
      credentials: credentialsSchema,
      registerData: registerDataSchema,
      tokens: tokenSchema,
    });
  }
}

describe("Auth", () => {
  let auth: TestAuth;
  let mockHttpRequest: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    auth = new TestAuth();
    mockHttpRequest = HttpClient.getInstance() as any;
  });

  describe("constructor", () => {
    it("should initialize with the correct pathname and schemas", () => {
      const auth = new TestAuth();

      expect((auth as any).pathname).toBe("/auth");
      expect((auth as any).userSchema).toBeDefined();
      expect((auth as any).credentialsSchema).toBeDefined();
      expect((auth as any).registerDataSchema).toBeDefined();
      expect((auth as any).tokenSchema).toBeDefined();
    });

    it("should initialize HttpClient", () => {
      new TestAuth();
      expect(HttpClient.getInstance).toHaveBeenCalled();
    });
  });

  describe("constructor with httpInstanceName", () => {
    it("should initialize with custom httpInstanceName", () => {
      class CustomAuth extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        TestTokens
      > {
        constructor() {
          super(
            "/auth",
            {
              user: z.object({
                id: z.string(),
                email: z.string().email(),
                name: z.string(),
              }),
              credentials: z.object({
                email: z.string().email(),
                password: z.string(),
              }),
              registerData: z.object({
                email: z.string().email(),
                password: z.string(),
                name: z.string(),
              }),
              tokens: z.object({
                accessToken: z.string(),
                refreshToken: z.string(),
              }),
            },
            "customInstance",
          );
        }
      }

      const customAuth = new CustomAuth();
      expect(HttpClient.getInstance).toHaveBeenCalledWith("customInstance");
      expect((customAuth as any).httpInstanceName).toBe("customInstance");
    });

    it("should work without httpInstanceName", () => {
      const auth = new TestAuth();
      expect(HttpClient.getInstance).toHaveBeenCalledWith(undefined);
      expect((auth as any).httpInstanceName).toBeUndefined();
    });
  });

  describe("HttpClient initialization", () => {
    it("should initialize HttpClient twice in constructor", () => {
      vi.clearAllMocks();

      new TestAuth();

      expect(HttpClient.getInstance).toHaveBeenCalledTimes(2);
    });
  });

  describe("optional schema handling", () => {
    it("should work without credentials schema", async () => {
      class NoCredentialsAuth extends Auth<
        TestUser,
        any,
        TestRegisterData,
        TestTokens
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string(),
            }),
            // No credentials schema
            registerData: z.object({
              email: z.string().email(),
              password: z.string(),
              name: z.string(),
            }),
            tokens: z.object({
              accessToken: z.string(),
              refreshToken: z.string(),
            }),
          });
        }
      }

      const auth = new NoCredentialsAuth();
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockHttpRequest.request.mockResolvedValueOnce({
        user: { id: "123", email: "test@example.com", name: "Test User" },
        tokens: { accessToken: "token", refreshToken: "refresh" },
      });

      // Should not throw even without schema validation
      await expect(auth.login(credentials)).resolves.toBeDefined();
    });

    it("should work without registerData schema", async () => {
      class NoRegisterDataAuth extends Auth<
        TestUser,
        TestCredentials,
        any,
        TestTokens
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string(),
            }),
            credentials: z.object({
              email: z.string().email(),
              password: z.string(),
            }),
            // No registerData schema
            tokens: z.object({
              accessToken: z.string(),
              refreshToken: z.string(),
            }),
          });
        }
      }

      const auth = new NoRegisterDataAuth();
      const registerData = {
        email: "test@example.com",
        password: "password123",
        name: "Test",
      };

      mockHttpRequest.request.mockResolvedValueOnce({
        user: { id: "123", email: "test@example.com", name: "Test" },
        tokens: { accessToken: "token", refreshToken: "refresh" },
      });

      await expect(auth.register(registerData)).resolves.toBeDefined();
    });

    it("should work without tokens schema", async () => {
      class NoTokensAuth extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        any
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string(),
            }),
            credentials: z.object({
              email: z.string().email(),
              password: z.string(),
            }),
            registerData: z.object({
              email: z.string().email(),
              password: z.string(),
              name: z.string(),
            }),
            // No tokens schema
          });
        }
      }

      const auth = new NoTokensAuth();

      mockHttpRequest.request.mockResolvedValueOnce({
        user: { id: "123", email: "test@example.com", name: "Test User" },
        tokens: { accessToken: "token", refreshToken: "refresh" },
      });

      const result = await auth.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.tokens).toEqual({
        accessToken: "token",
        refreshToken: "refresh",
      });
    });
  });

  describe("error handling precedence", () => {
    it("should throw schema validation error before making request in register", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
        name: "Test",
      };

      await expect(auth.register(invalidData as any)).rejects.toThrow();
      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });

    it("should throw schema validation error before making request in login", async () => {
      const invalidCredentials = {
        email: "invalid-email",
        password: "password123",
      };

      await expect(auth.login(invalidCredentials as any)).rejects.toThrow();
      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });

    it("should throw response validation error after successful request", async () => {
      mockHttpRequest.request.mockResolvedValueOnce({
        user: { id: "123", email: "invalid-email", name: "Test" },
        tokens: { accessToken: "token", refreshToken: "refresh" },
      });

      await expect(
        auth.login({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow();

      expect(mockHttpRequest.request).toHaveBeenCalled();
    });
  });

  describe("refreshToken without schema", () => {
    it("should return raw response when no token schema is defined", async () => {
      class NoTokenSchemaAuth extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        any
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string(),
            }),
          });
        }
      }

      const auth = new NoTokenSchemaAuth();
      const mockTokens = {
        accessToken: "new-token",
        refreshToken: "new-refresh",
      };

      mockHttpRequest.request.mockResolvedValueOnce(mockTokens);

      const result = await auth.refreshToken("old-refresh-token");

      expect(result).toEqual(mockTokens);
      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/refresh-token",
        data: { refreshToken: "old-refresh-token" },
      });
    });
  });

  describe("protected properties", () => {
    it("should properly set all protected properties", () => {
      class ExtendedAuth extends TestAuth {
        getProtectedProperties() {
          return {
            pathname: this.pathname,
            httpInstanceName: this.httpInstanceName,
            http: this.http,
            userSchema: this.userSchema,
            credentialsSchema: this.credentialsSchema,
            registerDataSchema: this.registerDataSchema,
            tokenSchema: this.tokenSchema,
          };
        }
      }

      const extendedAuth = new ExtendedAuth();
      const props = extendedAuth.getProtectedProperties();

      expect(props.pathname).toBe("/auth");
      expect(props.httpInstanceName).toBeUndefined();
      expect(props.http).toBeDefined();
      expect(props.userSchema).toBeDefined();
      expect(props.credentialsSchema).toBeDefined();
      expect(props.registerDataSchema).toBeDefined();
      expect(props.tokenSchema).toBeDefined();
    });
  });

  describe("complex error scenarios", () => {
    it("should handle schema validation errors with detailed messages", async () => {
      const invalidData = {
        email: "test@example.com",
        password: "pwd",
        name: "A", // Too short
      };

      class StrictAuth extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        TestTokens
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string().min(2),
            }),
            credentials: z.object({
              email: z.string().email(),
              password: z.string().min(8),
            }),
            registerData: z.object({
              email: z.string().email(),
              password: z.string().min(8),
              name: z.string().min(2),
            }),
            tokens: z.object({
              accessToken: z.string(),
              refreshToken: z.string(),
            }),
          });
        }
      }

      const strictAuth = new StrictAuth();

      await expect(strictAuth.register(invalidData)).rejects.toThrow();
    });

    it("should handle nested validation errors in response", async () => {
      mockHttpRequest.request.mockResolvedValueOnce({
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
          // Additional unexpected fields that might cause issues
          extra: "field",
        },
        tokens: {
          accessToken: "token",
          refreshToken: "refresh",
        },
      });

      const result = await auth.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user).toBeDefined();
    });
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const registerData: TestRegisterData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const responseData = {
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      const result = await auth.register(registerData);

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/register",
        data: registerData,
      });

      expect(result).toEqual(responseData.user);
    });

    it("should throw an error if registration fails", async () => {
      const registerData: TestRegisterData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const error = new Error("Registration failed");
      mockHttpRequest.request.mockRejectedValueOnce(error);

      await expect(auth.register(registerData)).rejects.toThrow(error);

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/register",
        data: registerData,
      });
    });

    it("should throw an error if data validation fails", async () => {
      const invalidRegisterData = {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      };

      await expect(auth.register(invalidRegisterData as any)).rejects.toThrow();

      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in a user successfully", async () => {
      const credentials: TestCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const responseData = {
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      const result = await auth.login(credentials);

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/login",
        data: credentials,
      });

      expect(result).toEqual(responseData);
    });

    it("should throw an error if login fails", async () => {
      const credentials: TestCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const error = new Error("Login failed");
      mockHttpRequest.request.mockRejectedValueOnce(error);

      await expect(auth.login(credentials)).rejects.toThrow(error);
    });
  });

  describe("logout", () => {
    it("should log out a user successfully", async () => {
      mockHttpRequest.request.mockResolvedValueOnce({});

      await auth.logout();

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/logout",
      });
    });

    it("should throw an error if logout fails", async () => {
      const error = new Error("Logout failed");
      mockHttpRequest.request.mockRejectedValueOnce(error);

      await expect(auth.logout()).rejects.toThrow(error);
    });
  });

  describe("refreshToken", () => {
    it("should refresh the token successfully", async () => {
      const refreshToken = "refresh-token";

      const responseData = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      const result = await auth.refreshToken(refreshToken);

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/auth/refresh-token",
        data: { refreshToken },
      });

      expect(result).toEqual(responseData);
    });

    it("should throw an error if token refresh fails", async () => {
      const refreshToken = "refresh-token";

      const error = new Error("Token refresh failed");
      mockHttpRequest.request.mockRejectedValueOnce(error);

      await expect(auth.refreshToken(refreshToken)).rejects.toThrow(error);
    });
  });

  describe("getCurrentUser", () => {
    it("should retrieve the current user successfully", async () => {
      const responseData = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      const result = await auth.getCurrentUser();

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "GET",
        url: "/auth/me",
      });

      expect(result).toEqual(responseData);
    });

    it("should throw an error if retrieving the user fails", async () => {
      const error = new Error("Get current user failed");
      mockHttpRequest.request.mockRejectedValueOnce(error);

      await expect(auth.getCurrentUser()).rejects.toThrow(error);
    });
  });

  describe("schema validation", () => {
    it("should validate user data returned by the API", async () => {
      const credentials: TestCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const responseData = {
        user: {
          id: "123",
          email: "test@example.com",
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      await expect(auth.login(credentials)).rejects.toThrow();
    });

    it("should validate tokens returned by the API", async () => {
      const refreshToken = "refresh-token";

      const responseData = {
        accessToken: "new-access-token",
      };

      mockHttpRequest.request.mockResolvedValueOnce(responseData);

      await expect(auth.refreshToken(refreshToken)).rejects.toThrow();
    });
  });

  describe("schema validation edge cases", () => {
    it("should throw error for invalid credentials format", async () => {
      const invalidCredentials = {
        email: "test@example.com",
      };

      await expect(auth.login(invalidCredentials as any)).rejects.toThrow();
      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });

    it("should throw error for invalid email format in credentials", async () => {
      const invalidCredentials = {
        email: "not-an-email",
        password: "password123",
      };

      await expect(auth.login(invalidCredentials as any)).rejects.toThrow();
      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });
  });

  describe("register data validation", () => {
    it("should throw error when name is missing", async () => {
      const invalidRegisterData = {
        email: "test@example.com",
        password: "password123",
      };

      await expect(auth.register(invalidRegisterData as any)).rejects.toThrow();
      expect(mockHttpRequest.request).not.toHaveBeenCalled();
    });

    it("should throw error for empty string values", async () => {
      const invalidRegisterData = {
        email: "test@example.com",
        password: "password123",
        name: "",
      };

      await expect(auth.register(invalidRegisterData as any)).rejects.toThrow();
    });
  });

  describe("register response validation", () => {
    it("should throw error if response does not match expected schema", async () => {
      const registerData: TestRegisterData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const invalidResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          // Missing name field
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockHttpRequest.request.mockResolvedValueOnce(invalidResponse);

      await expect(auth.register(registerData)).rejects.toThrow();
    });

    it("should throw error if tokens are missing in register response", async () => {
      const registerData: TestRegisterData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const invalidResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
        },
      };

      mockHttpRequest.request.mockResolvedValueOnce(invalidResponse);

      await expect(auth.register(registerData)).rejects.toThrow();
    });
  });
  describe("getCurrentUser response validation", () => {
    it("should throw error if user response is invalid", async () => {
      const invalidResponse = {
        id: "123",
        name: "Test User",
      };

      mockHttpRequest.request.mockResolvedValueOnce(invalidResponse);

      await expect(auth.getCurrentUser()).rejects.toThrow();
    });

    it("should handle null/undefined response", async () => {
      mockHttpRequest.request.mockResolvedValueOnce(null);

      await expect(auth.getCurrentUser()).rejects.toThrow();
    });
  });

  describe("network error handling", () => {
    it("should handle network timeout errors", async () => {
      const timeoutError = new Error("Network timeout");
      timeoutError.name = "TimeoutError";

      mockHttpRequest.request.mockRejectedValueOnce(timeoutError);

      await expect(
        auth.login({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(timeoutError);
    });

    it("should handle network connection errors", async () => {
      const networkError = new Error("Network error");
      networkError.name = "NetworkError";

      mockHttpRequest.request.mockRejectedValueOnce(networkError);

      await expect(auth.logout()).rejects.toThrow(networkError);
    });
  });

  describe("HTTP error responses", () => {
    it("should handle 401 unauthorized errors", async () => {
      const unauthorizedError = new Error("Unauthorized");
      (unauthorizedError as any).status = 401;

      mockHttpRequest.request.mockRejectedValueOnce(unauthorizedError);

      await expect(auth.getCurrentUser()).rejects.toThrow(unauthorizedError);
    });

    it("should handle 400 bad request errors", async () => {
      const badRequestError = new Error("Bad Request");
      (badRequestError as any).status = 400;

      mockHttpRequest.request.mockRejectedValueOnce(badRequestError);

      await expect(
        auth.login({
          email: "test@example.com",
          password: "wrong-password",
        }),
      ).rejects.toThrow(badRequestError);
    });
  });

  describe("refreshToken edge cases", () => {
    it("should handle empty refresh token", async () => {
      await expect(auth.refreshToken("")).rejects.toThrow();
    });

    it("should handle undefined refresh token", async () => {
      await expect(auth.refreshToken(undefined as any)).rejects.toThrow();
    });

    it("should validate refresh token response structure", async () => {
      const refreshToken = "refresh-token";

      const invalidResponse = {
        accessToken: "new-access-token",
      };

      mockHttpRequest.request.mockResolvedValueOnce(invalidResponse);

      await expect(auth.refreshToken(refreshToken)).rejects.toThrow();
    });
  });

  describe("URL construction", () => {
    it("should construct correct URLs with base pathname", () => {
      const authWithCustomPath = new (class extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        TestTokens
      > {
        constructor() {
          super("/api/v2/auth", {
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              name: z.string(),
            }),
            credentials: z.object({
              email: z.string().email(),
              password: z.string(),
            }),
            registerData: z.object({
              email: z.string().email(),
              password: z.string(),
              name: z.string(),
            }),
            tokens: z.object({
              accessToken: z.string(),
              refreshToken: z.string(),
            }),
          });
        }
      })();

      mockHttpRequest.request.mockResolvedValueOnce({});

      authWithCustomPath.logout();

      expect(mockHttpRequest.request).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/v2/auth/logout",
      });
    });
  });

  describe("concurrent requests", () => {
    it("should handle multiple simultaneous requests", async () => {
      const responseData = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
      };

      mockHttpRequest.request.mockResolvedValue(responseData);

      const promises = [
        auth.getCurrentUser(),
        auth.getCurrentUser(),
        auth.getCurrentUser(),
      ];

      const results = await Promise.all(promises);

      expect(mockHttpRequest.request).toHaveBeenCalledTimes(3);
      results.forEach((result) => {
        expect(result).toEqual(responseData);
      });
    });

    it("should handle mixed success and failure in concurrent requests", async () => {
      mockHttpRequest.request
        .mockResolvedValueOnce({
          id: "1",
          email: "test1@example.com",
          name: "User 1",
        })
        .mockRejectedValueOnce(new Error("Request failed"))
        .mockResolvedValueOnce({
          id: "2",
          email: "test2@example.com",
          name: "User 2",
        });

      const promises = [
        auth.getCurrentUser(),
        auth.getCurrentUser().catch((err) => err),
        auth.getCurrentUser(),
      ];

      const results = await Promise.all(promises);

      expect(results[0]).toEqual({
        id: "1",
        email: "test1@example.com",
        name: "User 1",
      });
      expect(results[1]).toBeInstanceOf(Error);
      expect(results[2]).toEqual({
        id: "2",
        email: "test2@example.com",
        name: "User 2",
      });
    });
  });

  describe("method chaining and state", () => {
    it("should allow sequential operations", async () => {
      const credentials: TestCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const loginResponse = {
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
        },
        tokens: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      const userResponse = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
      };

      mockHttpRequest.request
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(userResponse)
        .mockResolvedValueOnce({});

      const loginResult = await auth.login(credentials);
      const currentUser = await auth.getCurrentUser();
      await auth.logout();

      expect(loginResult).toEqual(loginResponse);
      expect(currentUser).toEqual(userResponse);
      expect(mockHttpRequest.request).toHaveBeenCalledTimes(3);
    });
  });

  describe("custom schema validation", () => {
    it("should handle schemas with additional validation rules", async () => {
      class StrictAuth extends Auth<
        TestUser,
        TestCredentials,
        TestRegisterData,
        TestTokens
      > {
        constructor() {
          super("/auth", {
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              name: z.string().min(2).max(50),
            }),
            credentials: z.object({
              email: z.string().email(),
              password: z.string().min(8),
            }),
            registerData: z.object({
              email: z.string().email(),
              password: z.string().min(8).regex(/[A-Z]/),
              name: z.string().min(2),
            }),
            tokens: z.object({
              accessToken: z.string().min(10),
              refreshToken: z.string().min(10),
            }),
          });
        }
      }

      const strictAuth = new StrictAuth();

      await expect(
        strictAuth.login({
          email: "test@example.com",
          password: "short",
        }),
      ).rejects.toThrow();

      mockHttpRequest.request.mockResolvedValueOnce({
        id: "not-a-uuid",
        email: "test@example.com",
        name: "Test User",
      });

      await expect(strictAuth.getCurrentUser()).rejects.toThrow();
    });
  });
});
