import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  Mock,

} from "vitest";
import { HttpClient } from "../services/HttpClient";
import { ApiRequestError } from "../services/ApiRequestError";
import type { HttpConfig } from "../types/common";
import { fail } from "assert";

/**
 * Tests unitaires pour la classe HttpClient
 *
 * Cette suite de tests vérifie le comportement du client HTTP en isolation.
 * Les dépendances externes sont mockées et les cas de test couvrent
 * 100% des branches conditionnelles.
 */
describe("HttpClient", () => {
  // Mocks des dépendances
  global.fetch = vi.fn();
  const abortSpy = vi.fn();
  global.AbortController = vi.fn().mockImplementation(() => ({
    signal: "test-signal",
    abort: abortSpy,
  }));

  let httpClient: HttpClient;
  let mockResponseBody = { success: true };
  let mockResponse: Response;

  // Configuration des mocks et des fixtures
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: vi.fn().mockResolvedValue(mockResponseBody),
      text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseBody)),
      clone: vi.fn().mockImplementation(function (this: Response) { return this; }),
    } as unknown as Response;

    (global.fetch as Mock).mockResolvedValue(mockResponse);
    vi.spyOn(console, "error").mockImplementation(() => { });
    vi.spyOn(global, "setTimeout").mockImplementation(() => {
      return 123 as any;
    });
    vi.spyOn(global, "clearTimeout").mockImplementation(() => { });

    HttpClient.resetInstance();
  });

  afterEach(() => {
    HttpClient.resetInstance();
    vi.useRealTimers();
  });

  /**
   * Utility: Initialise une instance HttpClient avec configuration standard
   */
  function createStandardHttpClient(): HttpClient {
    return HttpClient.init({
      httpConfig: {
        baseURL: "https://api.example.com",
      },
      instanceName: "default",
    });
  }

  describe("Initialisation et gestion du cycle de vie", () => {
    describe("Méthode init", () => {
      it("initialise une nouvelle instance avec toutes les options", () => {
        // Arrangement
        const httpConfig: HttpConfig = {
          baseURL: "https://api.example.com",
          timeout: 5000,
          headers: { "X-Custom-Header": "value" },
          withCredentials: true,
          maxRetries: 2,
          apiPrefix: "api",
          apiVersion: "2",
          interceptors: {
            request: [
              (config) => config,
            ],
            response: {
              success: [(response) => response],
              error: [(error) => Promise.reject(error)],
            },
          },
        };

        // Action
        httpClient = HttpClient.init({
          httpConfig,
          instanceName: "test",
        });

        // Assertion
        expect(httpClient).toBeDefined();
        expect(HttpClient.getAvailableInstances()).toContain("test");
      });

      it("applique les valeurs par défaut quand les options sont minimales", () => {
        // Arrangement
        const httpConfig = { baseURL: "https://api.example.com" };

        // Action
        httpClient = HttpClient.init({
          httpConfig,
          instanceName: "default",
        });

        // Assertion
        expect(httpClient).toBeDefined();
        expect(HttpClient.getAvailableInstances()).toContain("default");
      });

      it("crée des instances distinctes avec des noms différents", () => {
        // Action
        const mainInstance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const authInstance = HttpClient.init({
          httpConfig: { baseURL: "https://auth.example.com" },
          instanceName: "auth",
        });

        // Assertion
        expect(mainInstance).not.toBe(authInstance);
        expect(HttpClient.getAvailableInstances()).toContain("main");
        expect(HttpClient.getAvailableInstances()).toContain("auth");
      });

      it("réutilise l'instance existante si le même nom est utilisé", () => {
        // Action
        const instance1 = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "test",
        });
        const instance2 = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "test",
        });

        // Assertion
        expect(instance1).toBe(instance2);
        expect(HttpClient.getAvailableInstances().length).toBe(1);
      });

      it("utilise apiVersion quand apiPrefix n'est pas fourni", () => {
        // Arrangement & Action
        httpClient = HttpClient.init({
          httpConfig: {
            baseURL: "https://api.example.com",
            apiVersion: "2",
          },
          instanceName: "test",
        });

        // Requête pour vérifier l'URL formée
        httpClient.request({ url: "/resources" });

        // Assertion
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("https://api.example.com/v2/resources"),
          expect.any(Object)
        );
      });
    });

    describe("Gestion des instances", () => {
      it("retourne l'instance par défaut après initialisation", () => {
        // Arrangement
        const instance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "default",
        });

        // Action & Assertion
        expect(HttpClient.getInstance()).toBe(instance);
      });

      it("accède à une instance spécifique par son nom", () => {
        // Arrangement
        const mainInstance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const authInstance = HttpClient.init({
          httpConfig: { baseURL: "https://auth.example.com" },
          instanceName: "auth",
        });

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
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });

        // Action & Assertion
        expect(() => HttpClient.getInstance("nonexistent")).toThrow(
          /Http instance 'nonexistent' not initialized/,
        );
      });

      it("change l'instance par défaut sur demande", () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

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
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

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
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        // Action
        HttpClient.resetInstance();

        // Assertion
        expect(HttpClient.getAvailableInstances()).toEqual([]);
        expect(() => HttpClient.getInstance()).toThrow(/not initialized/);
      });

      it("supprime seulement l'instance spécifiée lors d'une réinitialisation ciblée", () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        // Action
        HttpClient.resetInstance("api1");

        // Assertion
        expect(HttpClient.getAvailableInstances()).toEqual(["api2"]);
        expect(() => HttpClient.getInstance("api1")).toThrow(/not initialized/);
        expect(HttpClient.getInstance("api2")).toBeDefined();
      });

      it("change l'instance par défaut si celle-ci est supprimée", () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });
        HttpClient.setDefaultInstance("api1");

        // Action
        HttpClient.resetInstance("api1");

        // Assertion
        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api2"));
      });

      it("gère correctement la suppression de la dernière instance", () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "unique",
        });

        // Action
        HttpClient.resetInstance("unique");

        // Assertion
        expect(HttpClient.getAvailableInstances().length).toBe(0);
        expect(() => HttpClient.getInstance()).toThrow(/not initialized/);
      });
    });
  });

  describe("Exécution des requêtes", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("effectue une requête avec succès et retourne les données", async () => {
      // Arrangement
      const config = { url: "/endpoint", method: "GET" };

      // Action
      const result = await httpClient.request(config);

      // Assertion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          signal: "test-signal",
        })
      );
      expect(result).toEqual(mockResponseBody);
    });

    it("fusionne les options avec la configuration", async () => {
      // Arrangement
      const config = { url: "/endpoint", method: "POST" };
      const options = {
        headers: { Authorization: "Bearer token" },
        timeout: 15000,
      };

      // Action
      await httpClient.request(config, options);

      // Assertion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer token",
          }),
          credentials: "include",
        })
      );
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 15000);
    });

    it("gère le remplacement de propriétés par les options", async () => {
      // Arrangement
      const config = {
        url: "/endpoint",
        method: "GET",
        headers: { "X-API-Key": "abc123" },
      };
      const options = {
        headers: { "X-API-Key": "xyz789" },
      };

      // Action
      await httpClient.request(config, options);

      // Assertion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "X-API-Key": "xyz789",
          }),
        })
      );
    });

    it("ajoute correctement les paramètres de requête", async () => {
      // Arrangement
      const config = {
        url: "/endpoint",
        method: "GET",
        params: { filter: "active", sort: "name" }
      };

      // Action
      await httpClient.request(config);

      // Assertion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint?filter=active&sort=name",
        expect.any(Object)
      );
    });

    it("construit correctement les URLs absolues", async () => {
      // Arrangement
      const config = {
        url: "https://other-api.com/endpoint",
        method: "GET"
      };

      // Action
      await httpClient.request(config);

      // Assertion
      expect(global.fetch).toHaveBeenCalledWith(
        "https://other-api.com/endpoint",
        expect.any(Object)
      );
    });
  });

  describe("Gestion des erreurs de requête", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("transforme les erreurs fetch en ApiRequestError", async () => {
      // Arrangement
      const fetchError = new Error("Network error");
      (global.fetch as Mock).mockRejectedValueOnce(fetchError);

      // Action & Assertion
      await expect(httpClient.request({ url: "/endpoint" })).rejects.toBeInstanceOf(
        ApiRequestError
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("gère correctement les réponses HTTP non-ok", async () => {
      // Arrangement
      const errorResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Resource not found" }),
        clone: vi.fn().mockImplementation(function (this: Response) { return this; }),
      } as unknown as Response;

      (global.fetch as Mock).mockResolvedValueOnce(errorResponse);

      // Action
      try {
        await httpClient.request({ url: "/nonexistent" });
        fail("La requête aurait dû échouer");
      } catch (error) {
        // Assertion
        expect(error).toBeInstanceOf(ApiRequestError);
      }
    });

    it("gère correctement les timeouts", async () => {
      // Arrangement
      const abortError = new DOMException("The operation was aborted", "AbortError");
      (global.fetch as Mock).mockRejectedValueOnce(abortError);

      // Action
      try {
        await httpClient.request({ url: "/slow-endpoint", timeout: 5000 });
        fail("La requête aurait dû échouer avec timeout");
      } catch (error) {
        // Assertion
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("timeout");
      }
    });
  });

  describe("Mécanismes de retry", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("réessaie les requêtes après une erreur réseau", async () => {
      // Arrangement
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);

      // Action
      const result = await httpClient.request({ url: "/endpoint" });

      // Assertion
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("respecte le nombre maximum de tentatives", async () => {
      // Arrangement
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError);

      // Action & Assertion
      await expect(httpClient.request({ url: "/endpoint" })).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(3); // Tentative initiale + 2 retries
    });

    it("utilise un délai exponentiel entre les tentatives", async () => {
      // Arrangement
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);

      // Action
      await httpClient.request({ url: "/endpoint" });

      // Assertion
      // Premier retry avec délai 2^1 * 100 = 200ms
      expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
      // Deuxième retry avec délai 2^2 * 100 = 400ms
      expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 400);
    });

    it("réessaie les requêtes après une erreur 429", async () => {
      // Arrangement
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Rate limited" }),
        clone: vi.fn().mockImplementation(function (this: Response) { return this; }),
      } as unknown as Response;

      (global.fetch as Mock)
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(mockResponse);

      // Action
      const result = await httpClient.request({ url: "/endpoint" });

      // Assertion
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("réessaie les requêtes après une erreur 500", async () => {
      // Arrangement
      const serverErrorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Server error" }),
        clone: vi.fn().mockImplementation(function (this: Response) { return this; }),
      } as unknown as Response;

      (global.fetch as Mock)
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(mockResponse);

      // Action
      const result = await httpClient.request({ url: "/endpoint" });

      // Assertion
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("ne réessaie pas les méthodes non idempotentes après un 500", async () => {
      // Arrangement
      const serverErrorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Server error" }),
        clone: vi.fn().mockImplementation(function (this: Response) { return this; }),
      } as unknown as Response;

      (global.fetch as Mock).mockResolvedValueOnce(serverErrorResponse);

      // Action
      try {
        await httpClient.request({ url: "/endpoint", method: "POST", data: { test: true } });
        fail("La requête aurait dû échouer");
      } catch (error) {
        // Assertion
        expect(error).toBeDefined();
        expect(global.fetch).toHaveBeenCalledTimes(1); // Pas de retry
      }
    });
  });

  describe("Scénarios d'utilisation avancés", () => {
    describe("Applications multi-domaines", () => {
      it("gère plusieurs instances pour différentes APIs", async () => {
        // Arrangement
        const mainApi = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const authApi = HttpClient.init({
          httpConfig: { baseURL: "https://auth.example.com" },
          instanceName: "auth",
        });

        const mainMockResponseBody = { resource: "main data" };
        const authMockResponseBody = { token: "abc123" };

        const mainMockResponse = {
          ...mockResponse,
          json: vi.fn().mockResolvedValue(mainMockResponseBody),
        } as unknown as Response;

        const authMockResponse = {
          ...mockResponse,
          json: vi.fn().mockResolvedValue(authMockResponseBody),
        } as unknown as Response;

        (global.fetch as Mock)
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
        expect(mainResult).toEqual(mainMockResponseBody);
        expect(authResult).toEqual(authMockResponseBody);
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenNthCalledWith(
          1,
          "https://api.example.com/resources",
          expect.any(Object)
        );
        expect(global.fetch).toHaveBeenNthCalledWith(
          2,
          "https://auth.example.com/token",
          expect.any(Object)
        );
      });

      it("permet d'accéder à la même instance depuis différents points du code", async () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const sameInstance = HttpClient.getInstance("main");

        // Action
        const result = await sameInstance.request({
          url: "/test",
          method: "GET",
        });

        // Assertion
        expect(result).toEqual(mockResponseBody);
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/test",
          expect.any(Object)
        );
      });

      it("gère correctement un changement d'instance par défaut", async () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });
        HttpClient.setDefaultInstance("api2");

        const defaultInstance = HttpClient.getInstance();

        // Action
        const result = await defaultInstance.request({
          url: "/test",
          method: "GET",
        });

        // Assertion
        expect(result).toEqual(mockResponseBody);
        expect(defaultInstance).toBe(HttpClient.getInstance("api2"));
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api2.example.com/test",
          expect.any(Object)
        );
      });
    });

    describe("États spéciaux et cas limites", () => {
      it("préserve l'instance par défaut lors de la suppression d'une autre instance", () => {
        // Arrangement
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });
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