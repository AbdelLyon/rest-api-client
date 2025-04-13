import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  Mock,
  type MockInstance,
} from "vitest";
import axios from "axios";
import axiosRetry from "axios-retry";
import { HttpClient } from "../services/HttpClient";
import { ApiRequestError } from "../services/ApiRequestError";
import type { AxiosError, AxiosInstance } from "axios";
import type { HttpConfigOptions } from "../types/common";

// Types d'utilitaires pour les tests
type HandlerType = (arg: any) => any;
interface InterceptorHandlers {
  requestSuccess: HandlerType;
  requestError: HandlerType;
  responseSuccess: HandlerType;
  responseError: HandlerType;
}

/**
 * Tests unitaires pour la classe HttpClient
 *
 * Cette suite de tests vérifie le comportement du client HTTP en isolation.
 * Les dépendances externes sont mockées et les cas de test couvrent
 * 100% des branches conditionnelles.
 */
describe("HttpClient", () => {
  // Configuration des mocks et des fixtures
  const mockAxiosInstance: AxiosInstance & {
    interceptors: {
      request: { use: MockInstance; };
      response: { use: MockInstance; };
    };
    request: Mock;
  } = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    request: vi.fn(),
  } as any;

  let httpClient: HttpClient;
  let handlers: InterceptorHandlers;

  // Mocks des dépendances
  vi.mock("axios");
  vi.mock("axios-retry");
  vi.mock("../services/ApiRequestError", () => ({
    ApiRequestError: class MockApiRequestError extends Error {
      constructor (public originalError: any, public requestConfig: any) {
        super("API Service Request Failed");
        this.name = "ApiRequestError";
      }
    },
  }));

  // Réinitialisation de l'environnement de test
  beforeEach(() => {
    vi.clearAllMocks();
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance);
    vi.spyOn(console, "error").mockImplementation(() => { });
    HttpClient.resetInstance();
  });

  afterEach(() => {
    HttpClient.resetInstance();
  });

  /**
   * Utility: Extrait et conserve les références aux handlers d'intercepteurs
   */
  function extractInterceptorHandlers(): InterceptorHandlers {
    return {
      requestSuccess:
        mockAxiosInstance.interceptors.request.use.mock.calls[0][0],
      requestError: mockAxiosInstance.interceptors.request.use.mock.calls[0][1],
      responseSuccess:
        mockAxiosInstance.interceptors.response.use.mock.calls[0][0],
      responseError:
        mockAxiosInstance.interceptors.response.use.mock.calls[0][1],
    };
  }

  /**
   * Utility: Initialise une instance HttpClient avec configuration standard
   */
  function createStandardHttpClient(): HttpClient {
    return HttpClient.init({
      baseURL: "https://api.example.com",
    });
  }

  describe("Initialisation et gestion du cycle de vie", () => {
    describe("Méthode init", () => {
      it("initialise une nouvelle instance avec toutes les options", () => {
        // Arrangement
        const options: HttpConfigOptions = {
          baseURL: "https://api.example.com",
          timeout: 5000,
          headers: { "X-Custom-Header": "value" },
          withCredentials: true,
          maxRetries: 2,
          apiPrefix: "api",
          apiVersion: "2",
        };

        // Action
        httpClient = HttpClient.init(options);

        // Assertion
        expect(axios.create).toHaveBeenCalledWith({
          baseURL: "https://api.example.com/api",
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Custom-Header": "value",
          },
          withCredentials: true,
        });

        expect(axiosRetry).toHaveBeenCalledWith(
          mockAxiosInstance,
          expect.objectContaining({
            retries: 2,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: expect.any(Function),
          }),
        );
        expect(
          mockAxiosInstance.interceptors.request.use,
        ).toHaveBeenCalledTimes(1);
        expect(
          mockAxiosInstance.interceptors.response.use,
        ).toHaveBeenCalledTimes(1);
      });

      it("applique les valeurs par défaut quand les options sont minimales", () => {
        // Arrangement
        const options = { baseURL: "https://api.example.com" };

        // Action
        httpClient = HttpClient.init(options);

        // Assertion
        expect(axios.create).toHaveBeenCalledWith({
          baseURL: "https://api.example.com",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });
        expect(axiosRetry).toHaveBeenCalledWith(
          mockAxiosInstance,
          expect.objectContaining({ retries: 3 }),
        );
      });

      it("crée des instances distinctes avec des noms différents", () => {
        // Action
        const mainInstance = HttpClient.init(
          { baseURL: "https://api.example.com" },
          "main",
        );
        const authInstance = HttpClient.init(
          { baseURL: "https://auth.example.com" },
          "auth",
        );

        // Assertion
        expect(mainInstance).not.toBe(authInstance);
        expect(axios.create).toHaveBeenCalledTimes(2);
      });

      it("réutilise l'instance existante si le même nom est utilisé", () => {
        // Action
        const instance1 = HttpClient.init(
          { baseURL: "https://api.example.com" },
          "test",
        );
        const instance2 = HttpClient.init(
          { baseURL: "https://api.example.com" },
          "test",
        );

        // Assertion
        expect(instance1).toBe(instance2);
        expect(axios.create).toHaveBeenCalledTimes(1);
      });

      it("utilise apiVersion quand apiPrefix n'est pas fourni", () => {
        // Arrangement
        const options = {
          baseURL: "https://api.example.com",
          apiVersion: "2",
        };

        // Action
        httpClient = HttpClient.init(options);

        // Assertion
        expect(axios.create).toHaveBeenCalledWith(
          expect.objectContaining({
            baseURL: "https://api.example.com/v2",
          }),
        );
      });
    });

    describe("Gestion des instances", () => {
      it("retourne l'instance par défaut après initialisation", () => {
        // Arrangement
        const instance = HttpClient.init({
          baseURL: "https://api.example.com",
        });

        // Action & Assertion
        expect(HttpClient.getInstance()).toBe(instance);
      });

      it("accède à une instance spécifique par son nom", () => {
        // Arrangement
        const mainInstance = HttpClient.init(
          { baseURL: "https://api.example.com" },
          "main",
        );
        const authInstance = HttpClient.init(
          { baseURL: "https://auth.example.com" },
          "auth",
        );

        // Action & Assertion
        expect(HttpClient.getInstance("main")).toBe(mainInstance);
        expect(HttpClient.getInstance("auth")).toBe(authInstance);
      });

      it("signale une erreur quand appelé avant initialisation", () => {
        // Action & Assertion
        expect(() => HttpClient.getInstance()).toThrow(
          /Http instance .* not initialized/,
        );
      });

      it("signale une erreur quand l'instance demandée n'existe pas", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api.example.com" }, "main");

        // Action & Assertion
        expect(() => HttpClient.getInstance("nonexistent")).toThrow(
          /Http instance 'nonexistent' not initialized/,
        );
      });

      it("change l'instance par défaut sur demande", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");

        // Action
        HttpClient.setDefaultInstance("api2");

        // Assertion
        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api2"));
      });

      it("refuse de définir une instance par défaut qui n'existe pas", () => {
        // Action & Assertion
        expect(() => HttpClient.setDefaultInstance("nonexistent")).toThrow(
          /Cannot set default: Http instance 'nonexistent' not initialized/,
        );
      });

      it("énumère toutes les instances disponibles", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");

        // Action
        const instances = HttpClient.getAvailableInstances();

        // Assertion
        expect(instances).toContain("api1");
        expect(instances).toContain("api2");
        expect(instances.length).toBe(2);
      });

      it("retourne une liste vide quand aucune instance n'est initialisée", () => {
        // Action & Assertion
        expect(HttpClient.getAvailableInstances()).toEqual([]);
      });

      it("supprime toutes les instances lors de la réinitialisation globale", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");

        // Action
        HttpClient.resetInstance();

        // Assertion
        expect(HttpClient.getAvailableInstances()).toEqual([]);
        expect(() => HttpClient.getInstance()).toThrow(/not initialized/);
      });

      it("supprime seulement l'instance spécifiée lors d'une réinitialisation ciblée", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");

        // Action
        HttpClient.resetInstance("api1");

        // Assertion
        expect(HttpClient.getAvailableInstances()).toEqual(["api2"]);
        expect(() => HttpClient.getInstance("api1")).toThrow(/not initialized/);
        expect(HttpClient.getInstance("api2")).toBeDefined();
      });

      it("change l'instance par défaut si celle-ci est supprimée", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");
        HttpClient.setDefaultInstance("api1");

        // Action
        HttpClient.resetInstance("api1");

        // Assertion
        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api2"));
      });

      it("gère correctement la suppression de la dernière instance", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api.example.com" }, "unique");

        // Action
        HttpClient.resetInstance("unique");

        // Assertion
        expect(HttpClient.getAvailableInstances().length).toBe(0);
        expect(() => HttpClient.getInstance()).toThrow(/not initialized/);
      });
    });

    // describe("Accesseurs et mutateurs internes", () => {
    //   it("permet d'accéder et de modifier l'instance axios", () => {
    //     // Arrangement
    //     httpClient = new HttpClient();
    //     const mockInstance = {} as AxiosInstance;

    //     // Action
    //     (httpClient as any).setAxiosInstance(mockInstance);
    //     const result = (httpClient as any).getAxiosInstance();

    //     // Assertion
    //     expect(result).toBe(mockInstance);
    //   });
    // });
  });

  // describe("Configuration des URLs et formatage", () => {
  //   let httpClient: HttpClient;

  //   beforeEach(() => {
  //     httpClient = new HttpClient();
  //   });

  //   it("conserve une URL de base standard", () => {
  //     // Arrangement
  //     const options = { baseURL: "https://api.example.com" };

  //     // Action
  //     const result = (httpClient as any).getFullBaseUrl(options);

  //     // Assertion
  //     expect(result).toBe("https://api.example.com");
  //   });

  //   it("normalise l'URL en supprimant les slashes de fin", () => {
  //     // Arrangement
  //     const options = { baseURL: "https://api.example.com/" };

  //     // Action
  //     const url = (httpClient as any).getFullBaseUrl(options);

  //     // Assertion
  //     expect(url).toBe("https://api.example.com");
  //   });

  //   it("ajoute un préfixe d'API quand spécifié", () => {
  //     // Arrangement
  //     const options = {
  //       baseURL: "https://api.example.com",
  //       apiPrefix: "api",
  //     };

  //     // Action
  //     const url = (httpClient as any).getFullBaseUrl(options);

  //     // Assertion
  //     expect(url).toBe("https://api.example.com/api");
  //   });

  //   it("normalise les préfixes d'API avec des slashes", () => {
  //     // Arrangement & Action & Assertion
  //     expect(
  //       (httpClient as any).getFullBaseUrl({
  //         baseURL: "https://api.example.com",
  //         apiPrefix: "/api/",
  //       }),
  //     ).toBe("https://api.example.com/api");

  //     expect(
  //       (httpClient as any).getFullBaseUrl({
  //         baseURL: "https://api.example.com/",
  //         apiPrefix: "/api/",
  //       }),
  //     ).toBe("https://api.example.com/api");
  //   });

  //   it("ajoute un préfixe de version quand apiVersion est fourni", () => {
  //     // Arrangement
  //     const options = {
  //       baseURL: "https://api.example.com",
  //       apiVersion: "2",
  //     };

  //     // Action
  //     const url = (httpClient as any).getFullBaseUrl(options);

  //     // Assertion
  //     expect(url).toBe("https://api.example.com/v2");
  //   });

  //   it("accepte apiVersion comme nombre", () => {
  //     // Arrangement
  //     const options = {
  //       baseURL: "https://api.example.com",
  //       apiVersion: 3,
  //     };

  //     // Action & Assertion
  //     expect((httpClient as any).getFullBaseUrl(options)).toBe(
  //       "https://api.example.com/v3",
  //     );
  //   });

  //   it("priorise apiPrefix sur apiVersion si les deux sont présents", () => {
  //     // Arrangement
  //     const options = {
  //       baseURL: "https://api.example.com",
  //       apiPrefix: "api",
  //       apiVersion: "2",
  //     };

  //     // Action
  //     const url = (httpClient as any).getFullBaseUrl(options);

  //     // Assertion
  //     expect(url).toBe("https://api.example.com/api");
  //   });

  //   it("signale une erreur quand baseURL est manquant", () => {
  //     // Arrangement
  //     // @ts-ignore - on force délibérément une erreur
  //     const options = { timeout: 5000 };

  //     // Action & Assertion
  //     expect(() => (httpClient as any).getFullBaseUrl(options)).toThrow(
  //       "baseURL is required",
  //     );
  //   });

  //   it("nettoie les espaces autour de l'URL de base", () => {
  //     // Arrangement
  //     const options = { baseURL: " https://api.example.com " };

  //     // Action & Assertion
  //     expect((httpClient as any).getFullBaseUrl(options)).toBe(
  //       "https://api.example.com",
  //     );
  //   });
  // });

  describe("Intercepteurs et traitement des requêtes", () => {
    describe("Configuration des intercepteurs", () => {
      beforeEach(() => {
        mockAxiosInstance.interceptors.request.use.mockClear();
        mockAxiosInstance.interceptors.response.use.mockClear();
        httpClient = createStandardHttpClient();
        handlers = extractInterceptorHandlers();
      });

      it("enregistre les intercepteurs de requête", () => {
        // Assertion
        expect(
          mockAxiosInstance.interceptors.request.use,
        ).toHaveBeenCalledTimes(1);
        expect(typeof handlers.requestSuccess).toBe("function");
        expect(typeof handlers.requestError).toBe("function");
      });

      it("transmet la configuration dans l'intercepteur de requête", () => {
        // Arrangement
        const config = { headers: { test: "value" } };

        // Action & Assertion
        expect(handlers.requestSuccess(config)).toBe(config);
      });

      it("enregistre les intercepteurs de réponse", () => {
        // Assertion
        expect(
          mockAxiosInstance.interceptors.response.use,
        ).toHaveBeenCalledTimes(1);
        expect(typeof handlers.responseSuccess).toBe("function");
        expect(typeof handlers.responseError).toBe("function");
      });

      it("transmet la réponse dans l'intercepteur de réponse", () => {
        // Arrangement
        const response = { data: { success: true } };

        // Action & Assertion
        expect(handlers.responseSuccess(response)).toBe(response);
      });

      it("propage les erreurs de requête", async () => {
        // Arrangement
        const testError = new Error("Erreur de requête");

        // Action & Assertion
        await expect(handlers.requestError(testError)).rejects.toBe(testError);
      });
    });

    describe("Traitement des erreurs de réponse", () => {
      beforeEach(() => {
        httpClient = createStandardHttpClient();
        handlers = extractInterceptorHandlers();
      });

      it("transforme les erreurs de réponse en ApiRequestError", async () => {
        // Arrangement
        const axiosError = {
          config: { url: "/test" },
          response: { status: 500 },
          message: "Server error",
        } as AxiosError;

        // Action & Assertion
        await expect(handlers.responseError(axiosError)).rejects.toBeInstanceOf(
          ApiRequestError,
        );
        expect(console.error).toHaveBeenCalled();
      });

      it("gère les erreurs sans configuration", async () => {
        // Arrangement
        const errorWithoutConfig = new Error("Network Error") as AxiosError;
        Object.assign(errorWithoutConfig, {
          isAxiosError: true,
          message: "Network Error",
          config: undefined,
          response: undefined,
        });

        // Action
        const handleErrorResponse = (
          httpClient as any
        ).handleErrorResponse.bind(httpClient);
        const error: ApiRequestError = await handleErrorResponse(
          errorWithoutConfig,
        ).catch((e: ApiRequestError) => e);

        // Assertion
        expect(error).toBeInstanceOf(ApiRequestError);
        expect(error.originalError).toBe(errorWithoutConfig);
        expect(error.requestConfig).toEqual({});
      });
    });

    describe("Journalisation des erreurs", () => {
      beforeEach(() => {
        httpClient = createStandardHttpClient();
      });

      it("enregistre les détails complets d'une erreur", () => {
        // Arrangement
        const logError = (httpClient as any).logError.bind(httpClient);
        const error = {
          config: { url: "/test", method: "GET" },
          response: { status: 500, data: { message: "Server Error" } },
          message: "Request failed",
        } as AxiosError;

        // Action
        logError(error);

        // Assertion
        expect(console.error).toHaveBeenCalledWith("API Request Error", {
          url: "/test",
          method: "GET",
          status: 500,
          data: { message: "Server Error" },
          message: "Request failed",
        });
      });

      it("gère les erreurs sans propriétés", () => {
        // Arrangement
        const logError = (httpClient as any).logError.bind(httpClient);
        const error = { message: "Network Error" } as AxiosError;

        // Action
        logError(error);

        // Assertion
        expect(console.error).toHaveBeenCalledWith("API Request Error", {
          url: undefined,
          method: undefined,
          status: undefined,
          data: undefined,
          message: "Network Error",
        });
      });

      it("traite les erreurs avec configuration partielle", () => {
        // Arrangement
        const logError = (httpClient as any).logError.bind(httpClient);
        const error = {
          config: { url: "/test" },
          message: "Error with partial config",
        } as AxiosError;

        // Action
        logError(error);

        // Assertion
        expect(console.error).toHaveBeenCalledWith(
          "API Request Error",
          expect.objectContaining({
            url: "/test",
            method: undefined,
          }),
        );
      });

      it("traite les erreurs avec réponse incomplète", () => {
        // Arrangement
        const logError = (httpClient as any).logError.bind(httpClient);
        const error = {
          config: { url: "/test", method: "GET" },
          response: {},
          message: "Error with empty response",
        } as AxiosError;

        // Action
        logError(error);

        // Assertion
        expect(console.error).toHaveBeenCalledWith(
          "API Request Error",
          expect.objectContaining({
            status: undefined,
            data: undefined,
          }),
        );
      });
    });
  });

  describe("Exécution des requêtes", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("effectue une requête avec succès et retourne les données", async () => {
      // Arrangement
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);
      const config = { url: "/endpoint", method: "GET" };

      // Action
      const result = await httpClient.request(config);

      // Assertion
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

    it("fusionne les options avec la configuration", async () => {
      // Arrangement
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);
      const config = { url: "/endpoint", method: "POST" };
      const options = {
        headers: { Authorization: "Bearer token" },
        timeout: 15000,
      };

      // Action
      await httpClient.request(config, options);

      // Assertion
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

    it("gère le remplacement de propriétés par les options", async () => {
      // Arrangement
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);
      const config = {
        url: "/endpoint",
        method: "GET",
        headers: { "X-API-Key": "abc123" },
      };
      const options = {
        url: "/override",
        headers: { "X-API-Key": "xyz789" },
      };

      // Action
      await httpClient.request(config, options);

      // Assertion
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "/override", // L'URL dans options écrase celle dans config
          method: "GET", // La méthode reste celle de config
          headers: expect.objectContaining({
            "X-API-Key": "xyz789", // Les en-têtes sont fusionnés, priorité aux options
          }),
        }),
      );
    });

    it("gère les valeurs de data particulières", async () => {
      // Arrangement & Action & Assertion

      // Chaîne vide
      mockAxiosInstance.request.mockResolvedValueOnce({ data: "" });
      expect(await httpClient.request({ url: "/empty-string" })).toBe("");

      // Booléen false
      mockAxiosInstance.request.mockResolvedValueOnce({ data: false });
      expect(await httpClient.request({ url: "/boolean-false" })).toBe(false);

      // Nombre 0
      mockAxiosInstance.request.mockResolvedValueOnce({ data: 0 });
      expect(await httpClient.request({ url: "/number-zero" })).toBe(0);

      // Null explicite
      mockAxiosInstance.request.mockResolvedValueOnce({ data: null });
      expect(await httpClient.request({ url: "/null-data" })).toBeNull();

      // Réponse sans propriété data
      mockAxiosInstance.request.mockResolvedValueOnce({ status: 204 });
      expect(await httpClient.request({ url: "/no-content" })).toBeUndefined();
    });

    it("gère le remplacement complet des en-têtes par défaut", async () => {
      // Arrangement
      const mockResponse = { data: {} };
      mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);
      const fullOptions = {
        timeout: 15000,
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/xml",
        },
      };

      // Action
      await httpClient.request({ url: "/test" }, fullOptions);

      // Assertion
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 15000,
          headers: expect.objectContaining({
            "Content-Type": "application/xml",
            Accept: "application/xml",
          }),
        }),
      );
    });
  });

  describe("Gestion des erreurs de requête", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("transforme les erreurs axios en ApiRequestError", async () => {
      // Arrangement
      const axiosError = new Error("Request failed") as AxiosError;
      Object.assign(axiosError, {
        isAxiosError: true,
        config: { url: "/endpoint", method: "GET" },
        response: { status: 500, data: { message: "Server error" } },
        message: "Request failed with status code 500",
        toJSON: () => ({}),
      });
      mockAxiosInstance.request.mockRejectedValueOnce(axiosError);

      // Action & Assertion
      await expect(httpClient.request({ url: "/endpoint" })).rejects.toThrow(
        "API Service Request Failed",
      );
      await expect(
        httpClient.request({ url: "/endpoint" }),
      ).rejects.toBeInstanceOf(ApiRequestError);
    });

    it("propage les ApiRequestError sans transformation", async () => {
      // Arrangement
      const existingError = new ApiRequestError(
        { message: "Original error" } as AxiosError,
        { url: "/endpoint" },
      );
      mockAxiosInstance.request.mockRejectedValueOnce(existingError);

      // Action & Assertion
      await expect(httpClient.request({ url: "/endpoint" })).rejects.toBe(
        existingError,
      );
    });
  });

  describe("Mécanismes de retry", () => {
    describe("Configuration", () => {
      it("utilise les options de retry spécifiées", () => {
        // Arrangement & Action
        httpClient = HttpClient.init({
          baseURL: "https://api.example.com",
          maxRetries: 5,
        });

        // Assertion
        expect(axiosRetry).toHaveBeenCalledWith(
          mockAxiosInstance,
          expect.objectContaining({
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: expect.any(Function),
          }),
        );
      });

      it("applique la valeur par défaut pour maxRetries", () => {
        // Arrangement & Action
        httpClient = HttpClient.init({
          baseURL: "https://api.example.com",
        });

        // Assertion
        expect(axiosRetry).toHaveBeenCalledWith(
          mockAxiosInstance,
          expect.objectContaining({
            retries: 3, // Valeur par défaut
          }),
        );
      });
    });

    describe("Condition de retry", () => {
      beforeEach(() => {
        httpClient = createStandardHttpClient();
      });

      it("retry sur erreurs réseau via axiosRetry", () => {
        // Arrangement
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(true);
        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = { isAxiosError: true } as AxiosError;

        // Action & Assertion
        expect(isRetryableError(error)).toBe(true);
        expect(
          axiosRetry.isNetworkOrIdempotentRequestError,
        ).toHaveBeenCalledWith(error);
      });

      it("retry sur erreurs 429 (rate limiting)", () => {
        // Arrangement
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);
        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = {
          isAxiosError: true,
          response: { status: 429 },
        } as AxiosError;

        // Action & Assertion
        expect(isRetryableError(error)).toBe(true);
      });

      it("ne retry pas sur autres erreurs HTTP", () => {
        // Arrangement
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);
        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const error = {
          isAxiosError: true,
          response: { status: 400 },
        } as AxiosError;

        // Action & Assertion
        expect(isRetryableError(error)).toBe(false);
      });

      it("traite correctement les erreurs sans propriété response", () => {
        // Arrangement
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);
        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const errorWithoutResponse = { isAxiosError: true } as AxiosError;

        // Action & Assertion
        expect(isRetryableError(errorWithoutResponse)).toBe(false);
      });

      it("traite correctement les erreurs avec response mais sans status", () => {
        // Arrangement
        vi.mocked(axiosRetry).isNetworkOrIdempotentRequestError = vi
          .fn()
          .mockReturnValue(false);
        const isRetryableError = (httpClient as any).isRetryableError.bind(
          httpClient,
        );
        const errorWithEmptyResponse = {
          isAxiosError: true,
          response: {},
        } as AxiosError;

        // Action & Assertion
        expect(isRetryableError(errorWithEmptyResponse)).toBe(false);
      });

      it("est correctement transmis à axiosRetry", () => {
        // Arrangement & Action
        const retryOptions = vi.mocked(axiosRetry).mock.calls[0][1] as {
          retryCondition: unknown;
        };

        // Assertion
        expect(retryOptions).toHaveProperty("retryCondition");
        expect(typeof retryOptions.retryCondition).toBe("function");
      });
    });
  });

  describe("Scénarios d'utilisation avancés", () => {
    describe("Applications multi-domaines", () => {
      it("gère plusieurs instances pour différentes APIs", async () => {
        // Arrangement
        const mainApi = HttpClient.init(
          { baseURL: "https://api.example.com" },
          "main",
        );
        const authApi = HttpClient.init(
          { baseURL: "https://auth.example.com" },
          "auth",
        );

        const mainMockResponse = { data: { resource: "main data" } };
        const authMockResponse = { data: { token: "abc123" } };

        mockAxiosInstance.request
          .mockResolvedValueOnce(mainMockResponse)
          .mockResolvedValueOnce(authMockResponse);

        // Action
        const mainResult = await mainApi.request({
          url: "/resources",
          method: "GET",
        });
        const authResult = await authApi.request({
          url: "/token",
          method: "POST",
        });

        // Assertion
        expect(mainResult).toEqual(mainMockResponse.data);
        expect(authResult).toEqual(authMockResponse.data);
        expect(mockAxiosInstance.request).toHaveBeenCalledTimes(2);
      });

      it("permet d'accéder à la même instance depuis différents points du code", async () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api.example.com" }, "main");
        const sameInstance = HttpClient.getInstance("main");
        const mockResponse = { data: { success: true } };
        mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

        // Action
        const result = await sameInstance.request({
          url: "/test",
          method: "GET",
        });

        // Assertion
        expect(result).toEqual(mockResponse.data);
      });

      it("gère correctement un changement d'instance par défaut", async () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");
        HttpClient.setDefaultInstance("api2");

        const defaultInstance = HttpClient.getInstance();
        const mockResponse = { data: { source: "api2" } };
        mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

        // Action
        const result = await defaultInstance.request({
          url: "/test",
          method: "GET",
        });

        // Assertion
        expect(result).toEqual(mockResponse.data);
        expect(defaultInstance).toBe(HttpClient.getInstance("api2"));
      });
    });

    describe("États spéciaux et cas limites", () => {
      // it("traite correctement une instance sans configuration initiale", () => {
      //   // Arrangement & Action
      //   const rawClient = new HttpClient();

      //   // Assertion
      //   expect((rawClient as any).axiosInstance).toBeUndefined();

      //   // Action supplémentaire
      //   (rawClient as any).setAxiosInstance(mockAxiosInstance);

      //   // Assertion supplémentaire
      //   expect((rawClient as any).axiosInstance).toBe(mockAxiosInstance);
      // });

      it("préserve l'instance par défaut lors de la suppression d'une autre instance", () => {
        // Arrangement
        HttpClient.init({ baseURL: "https://api1.example.com" }, "api1");
        HttpClient.init({ baseURL: "https://api2.example.com" }, "api2");
        HttpClient.setDefaultInstance("api1");

        // Action
        HttpClient.resetInstance("api2");

        // Assertion
        expect(HttpClient.getAvailableInstances()).toEqual(["api1"]);
        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api1"));
      });
    });
  });
});
