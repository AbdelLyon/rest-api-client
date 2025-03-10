import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import axiosRetry from "axios-retry";
import { HttpClient } from "@/services";
import { ApiRequestError } from "@/services/ApiRequestError";

// Mock des dépendances
vi.mock("axios");
vi.mock("axios-retry");
vi.mock("@/services/ApiRequestError", () => ({
  ApiRequestError: class MockApiRequestError extends Error {
    constructor(public originalError: any, public requestConfig: any) {
      super("API Service Request Failed");
      this.name = "ApiRequestError";
    }
  },
}));

describe("HttpClient", () => {
  let httpClient: HttpClient;
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance);
    vi.spyOn(console, "error").mockImplementation(() => {});
    HttpClient.resetInstance();
  });

  afterEach(() => {
    HttpClient.resetInstance();
  });

  // Groupe de tests 1: Méthodes statiques et initialisation
  describe("Méthodes statiques et initialisation", () => {
    describe("init", () => {
      it("devrait créer une nouvelle instance avec les options fournies", () => {
        const options = {
          baseURL: "https://api.example.com",
          timeout: 5000,
          headers: { "X-Custom-Header": "value" },
          withCredentials: true,
          maxRetries: 2,
        };

        httpClient = HttpClient.init(options);

        expect(axios.create).toHaveBeenCalledWith({
          baseURL: "https://api.example.com",
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Custom-Header": "value",
          },
          withCredentials: true,
        });

        expect(axiosRetry).toHaveBeenCalled();
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
        expect(httpClient).toBeInstanceOf(HttpClient);
      });

      it("devrait utiliser les valeurs par défaut quand les options sont omises", () => {
        const options = {
          baseURL: "https://api.example.com",
        };

        httpClient = HttpClient.init(options);

        expect(axios.create).toHaveBeenCalledWith({
          baseURL: "https://api.example.com",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });
      });

      it("devrait retourner la même instance si déjà initialisée", () => {
        const options = { baseURL: "https://api.example.com" };

        const instance1 = HttpClient.init(options);
        const instance2 = HttpClient.init(options);

        expect(instance1).toBe(instance2);
        expect(axios.create).toHaveBeenCalledTimes(1);
      });
    });

    describe("getInstance", () => {
      it("devrait retourner l'instance initialisée", () => {
        const options = { baseURL: "https://api.example.com" };
        const instance = HttpClient.init(options);

        expect(HttpClient.getInstance()).toBe(instance);
      });

      it("devrait lancer une erreur si appelé avant init", () => {
        expect(() => HttpClient.getInstance()).toThrow(
          "Http not initialized. Call Http.init() first.",
        );
      });
    });

    describe("resetInstance", () => {
      it("devrait réinitialiser l'instance singleton", () => {
        const options = { baseURL: "https://api.example.com" };

        HttpClient.init(options);
        expect(HttpClient.getInstance()).toBeDefined();

        HttpClient.resetInstance();

        expect(() => HttpClient.getInstance()).toThrow("Http not initialized");
      });
    });
  });

  // Groupe de tests 2: Méthodes protégées
  describe("Méthodes protégées", () => {
    describe("getAxiosInstance et setAxiosInstance", () => {
      it("devrait permettre d'obtenir et définir l'instance axios", () => {
        httpClient = new HttpClient();
        const mockInstance = {} as any;

        // Accéder aux méthodes protégées
        (httpClient as any).setAxiosInstance(mockInstance);
        const result = (httpClient as any).getAxiosInstance();

        expect(result).toBe(mockInstance);
      });
    });

    describe("getFullBaseUrl", () => {
      let httpClient: HttpClient;

      beforeEach(() => {
        httpClient = new HttpClient();
      });

      it("devrait retourner l'URL de base simple", () => {
        const options = { baseURL: "https://api.example.com" };
        const result = (httpClient as any).getFullBaseUrl(options);
        expect(result).toBe("https://api.example.com");
      });

      it("devrait traiter correctement l'URL qui se termine par un slash", () => {
        const options = { baseURL: "https://api.example.com/" };
        const url = (httpClient as any).getFullBaseUrl(options);
        expect(url).toBe("https://api.example.com");
      });

      it("devrait ajouter un préfixe d'API quand apiPrefix est fourni", () => {
        const options = {
          baseURL: "https://api.example.com",
          apiPrefix: "api",
        };
        const url = (httpClient as any).getFullBaseUrl(options);
        expect(url).toBe("https://api.example.com/api");
      });

      it("devrait formater correctement le préfixe d'API avec des slashes", () => {
        const options1 = {
          baseURL: "https://api.example.com",
          apiPrefix: "/api/",
        };
        expect((httpClient as any).getFullBaseUrl(options1)).toBe(
          "https://api.example.com/api",
        );

        const options2 = {
          baseURL: "https://api.example.com/",
          apiPrefix: "/api/",
        };
        expect((httpClient as any).getFullBaseUrl(options2)).toBe(
          "https://api.example.com/api",
        );
      });

      it("devrait ajouter un préfixe de version quand apiVersion est fourni", () => {
        const options = {
          baseURL: "https://api.example.com",
          apiVersion: "2",
        };
        const url = (httpClient as any).getFullBaseUrl(options);
        expect(url).toBe("https://api.example.com/v2");
      });

      it("devrait prioriser apiPrefix sur apiVersion si les deux sont fournis", () => {
        const options = {
          baseURL: "https://api.example.com",
          apiPrefix: "api",
          apiVersion: "2",
        };
        const url = (httpClient as any).getFullBaseUrl(options);
        expect(url).toBe("https://api.example.com/api");
      });

      it("devrait lancer une erreur si baseURL n'est pas fourni", () => {
        // @ts-ignore - on force délibérément une erreur
        const options = { timeout: 5000 };
        expect(() => (httpClient as any).getFullBaseUrl(options)).toThrow(
          "baseURL is required",
        );
      });
    });
  });

  // Groupe de tests 3: Méthodes publiques
  describe("Méthodes publiques", () => {
    describe("request", () => {
      beforeEach(() => {
        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });
      });

      it("devrait effectuer une requête avec succès et retourner les données", async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

        const config = { url: "/endpoint", method: "GET" };
        const result = await httpClient.request(config);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith({
          url: "/endpoint",
          method: "GET",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        expect(result).toEqual(mockResponse.data);
      });

      it("devrait fusionner les options supplémentaires avec la configuration", async () => {
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

        const config = { url: "/endpoint", method: "POST" };
        const options = {
          headers: { Authorization: "Bearer token" },
          timeout: 15000,
        };

        await httpClient.request(config, options);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/endpoint",
            method: "POST",
            timeout: 15000,
            headers: expect.objectContaining({
              Authorization: "Bearer token",
            }),
          }),
        );
      });

      it("devrait gérer les erreurs et lancer une ApiRequestError", async () => {
        const axiosError = new Error("Request failed") as any;
        Object.assign(axiosError, {
          isAxiosError: true,
          config: { url: "/endpoint", method: "GET" },
          response: { status: 500, data: { message: "Server error" } },
          message: "Request failed with status code 500",
          toJSON: () => ({}),
        });

        mockAxiosInstance.request.mockRejectedValueOnce(axiosError);
        const config = { url: "/endpoint", method: "GET" };

        await expect(httpClient.request(config)).rejects.toThrow(
          "API Service Request Failed",
        );
        await expect(httpClient.request(config)).rejects.toBeInstanceOf(
          ApiRequestError,
        );
      });

      it("devrait relancer une ApiRequestError existante", async () => {
        const existingError = new ApiRequestError(
          { message: "Original error" } as any,
          { url: "/endpoint" },
        );

        mockAxiosInstance.request.mockRejectedValueOnce(existingError);
        const config = { url: "/endpoint", method: "GET" };

        await expect(httpClient.request(config)).rejects.toBe(existingError);
      });
    });
  });

  // Groupe de tests 4: Configuration des intercepteurs et gestion des erreurs
  describe("Intercepteurs et gestion des erreurs", () => {
    describe("Intercepteurs HTTP", () => {
      it("devrait configurer les intercepteurs de requête correctement", () => {
        mockAxiosInstance.interceptors.request.use.mockClear();

        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });

        expect(
          mockAxiosInstance.interceptors.request.use,
        ).toHaveBeenCalledTimes(1);

        // Tester le gestionnaire de succès
        const requestSuccessHandler =
          mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
        const config = { headers: { test: "value" } };
        expect(requestSuccessHandler(config)).toBe(config);

        // Tester que le gestionnaire d'erreur existe
        const requestErrorHandler =
          mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
        expect(typeof requestErrorHandler).toBe("function");
      });

      it("devrait configurer les intercepteurs de réponse correctement", () => {
        mockAxiosInstance.interceptors.response.use.mockClear();

        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });

        expect(
          mockAxiosInstance.interceptors.response.use,
        ).toHaveBeenCalledTimes(1);

        // Tester le gestionnaire de succès
        const responseSuccessHandler =
          mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
        const response = { data: { success: true } };
        expect(responseSuccessHandler(response)).toBe(response);

        // Tester que le gestionnaire d'erreur existe
        const responseErrorHandler =
          mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
        expect(typeof responseErrorHandler).toBe("function");
      });

      it("devrait traiter les erreurs de réponse avec handleErrorResponse", async () => {
        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });

        // Récupérer le gestionnaire d'erreur de l'intercepteur
        const responseErrorHandler =
          mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

        const axiosError = {
          config: { url: "/test" },
          response: { status: 500 },
          message: "Server error",
        } as any;

        try {
          await responseErrorHandler(axiosError);
          expect.fail("La méthode aurait dû lancer une erreur");
        } catch (error) {
          expect(error).toBeInstanceOf(ApiRequestError);
          expect((error as ApiRequestError).originalError).toBe(axiosError);
        }

        expect(console.error).toHaveBeenCalled();
      });
    });

    describe("Gestion des erreurs", () => {
      beforeEach(() => {
        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });
      });

      it("devrait traiter correctement les erreurs sans configuration", async () => {
        const errorWithoutConfig = new Error("Network Error") as any;
        Object.assign(errorWithoutConfig, {
          isAxiosError: true,
          message: "Network Error",
          config: undefined,
          response: undefined,
        });

        // Accéder à la méthode privée handleErrorResponse
        const handleErrorResponse = (
          httpClient as any
        ).handleErrorResponse.bind(httpClient);

        try {
          await handleErrorResponse(errorWithoutConfig);
          expect.fail("La méthode aurait dû lancer une erreur");
        } catch (error) {
          expect(error).toBeInstanceOf(ApiRequestError);
          expect((error as ApiRequestError).originalError).toBe(
            errorWithoutConfig,
          );
          expect((error as ApiRequestError).requestConfig).toEqual({});
        }

        expect(console.error).toHaveBeenCalled();
      });

      it("devrait enregistrer les détails de l'erreur", () => {
        const logError = (httpClient as any).logError.bind(httpClient);

        const error = {
          config: { url: "/test", method: "GET" },
          response: { status: 500, data: { message: "Server Error" } },
          message: "Request failed",
        } as any;

        logError(error);

        expect(console.error).toHaveBeenCalledWith("API Request Error", {
          url: "/test",
          method: "GET",
          status: 500,
          data: { message: "Server Error" },
          message: "Request failed",
        });
      });

      it("devrait gérer les erreurs sans configuration ou réponse", () => {
        const logError = (httpClient as any).logError.bind(httpClient);

        const error = {
          message: "Network Error",
        } as any;

        logError(error);

        expect(console.error).toHaveBeenCalledWith("API Request Error", {
          url: undefined,
          method: undefined,
          status: undefined,
          data: undefined,
          message: "Network Error",
        });
      });
    });
  });

  // Groupe de tests 5: Configuration des mécanismes de retry
  describe("Mécanismes de retry", () => {
    describe("configureRetry", () => {
      it("devrait configurer axiosRetry avec les bonnes options", () => {
        httpClient = HttpClient.init({
          baseURL: "https://api.example.com",
          maxRetries: 5,
        });

        expect(axiosRetry).toHaveBeenCalledWith(
          mockAxiosInstance,
          expect.objectContaining({
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: expect.any(Function),
          }),
        );
      });
    });

    describe("isRetryableError", () => {
      beforeEach(() => {
        httpClient = HttpClient.init({ baseURL: "https://api.example.com" });
      });

      it("devrait retourner true pour une erreur réseau", () => {
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(true);

        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = { isAxiosError: true } as any;

        expect(isRetryableError(error)).toBe(true);
        expect(
          axiosRetry.isNetworkOrIdempotentRequestError,
        ).toHaveBeenCalledWith(error);
      });

      it("devrait retourner true pour une erreur 429", () => {
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);

        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = {
          isAxiosError: true,
          response: { status: 429 },
        } as any;

        expect(isRetryableError(error)).toBe(true);
      });

      it("devrait retourner false pour les autres erreurs", () => {
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);

        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = {
          isAxiosError: true,
          response: { status: 400 },
        } as any;

        expect(isRetryableError(error)).toBe(false);
      });

      it("devrait être utilisé dans la configuration de axiosRetry", () => {
        const retryOptions = vi.mocked(axiosRetry).mock.calls[0][1] as {
          retryCondition: unknown;
        };
        expect(retryOptions).toHaveProperty("retryCondition");
        expect(typeof retryOptions.retryCondition).toBe("function");
      });
    });
  });
});
