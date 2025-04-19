import { fail } from "node:assert";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpClient } from "../http/HttpClient";
import { ApiRequestError } from "../error/ApiRequestError";
import type { Mock } from "vitest";
import type { HttpConfig } from "@/http/types/http";

describe("HttpClient", () => {
  global.fetch = vi.fn();
  const abortSpy = vi.fn();
  global.AbortController = vi.fn().mockImplementation(() => ({
    signal: "test-signal",
    abort: abortSpy,
  }));

  let httpClient: HttpClient;
  const mockResponseBody = { success: true };
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
      clone: vi.fn().mockImplementation(function (this: Response) {
        return this;
      }),
    } as unknown as Response;

    (global.fetch as Mock).mockResolvedValue(mockResponse);
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(global, "setTimeout").mockImplementation(() => {
      return 123 as any;
    });
    vi.spyOn(global, "clearTimeout").mockImplementation(() => {});

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
        const httpConfig: HttpConfig = {
          baseURL: "https://api.example.com",
          timeout: 5000,
          headers: { "X-Custom-Header": "value" },
          withCredentials: true,
          maxRetries: 2,
          apiPrefix: "api",
          apiVersion: "2",
          interceptors: {
            request: [(config) => config],
            response: {
              success: [(response) => response],
              error: [(error) => Promise.reject(error)],
            },
          },
        };

        httpClient = HttpClient.init({
          httpConfig,
          instanceName: "test",
        });

        expect(httpClient).toBeDefined();
        expect(HttpClient.getAvailableInstances()).toContain("test");
      });

      it("applique les valeurs par défaut quand les options sont minimales", () => {
        const httpConfig = { baseURL: "https://api.example.com" };

        httpClient = HttpClient.init({
          httpConfig,
          instanceName: "default",
        });

        expect(httpClient).toBeDefined();
        expect(HttpClient.getAvailableInstances()).toContain("default");
      });

      it("crée des instances distinctes avec des noms différents", () => {
        const mainInstance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const authInstance = HttpClient.init({
          httpConfig: { baseURL: "https://auth.example.com" },
          instanceName: "auth",
        });

        expect(mainInstance).not.toBe(authInstance);
        expect(HttpClient.getAvailableInstances()).toContain("main");
        expect(HttpClient.getAvailableInstances()).toContain("auth");
      });

      it("réutilise l'instance existante si le même nom est utilisé", () => {
        const instance1 = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "test",
        });
        const instance2 = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "test",
        });

        expect(instance1).toBe(instance2);
        expect(HttpClient.getAvailableInstances().length).toBe(1);
      });

      it("utilise apiVersion quand apiPrefix n'est pas fourni", () => {
        httpClient = HttpClient.init({
          httpConfig: {
            baseURL: "https://api.example.com",
            apiVersion: "2",
          },
          instanceName: "test",
        });

        // Requête pour vérifier l'URL formée
        httpClient.request({ url: "/resources" });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("https://api.example.com/v2/resources"),
          expect.any(Object),
        );
      });
    });

    describe("Gestion des instances", () => {
      it("retourne l'instance par défaut après initialisation", () => {
        const instance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "default",
        });

        expect(HttpClient.getInstance()).toBe(instance);
      });

      it("accède à une instance spécifique par son nom", () => {
        const mainInstance = HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const authInstance = HttpClient.init({
          httpConfig: { baseURL: "https://auth.example.com" },
          instanceName: "auth",
        });

        expect(HttpClient.getInstance("main")).toBe(mainInstance);
        expect(HttpClient.getInstance("auth")).toBe(authInstance);
      });

      it("signale une erreur quand appelé avant initialisation", () => {
        expect(() => HttpClient.getInstance()).toThrow(
          /Http instance .* not initialized/,
        );
      });

      it("signale une erreur quand l'instance demandée n'existe pas", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });

        expect(() => HttpClient.getInstance("nonexistent")).toThrow(
          /Http instance 'nonexistent' not initialized/,
        );
      });

      it("change l'instance par défaut sur demande", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        HttpClient.setDefaultInstance("api2");

        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api2"));
      });

      it("refuse de définir une instance par défaut qui n'existe pas", () => {
        expect(() => HttpClient.setDefaultInstance("nonexistent")).toThrow(
          /Cannot set default: Http instance 'nonexistent' not initialized/,
        );
      });

      it("énumère toutes les instances disponibles", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        const instances = HttpClient.getAvailableInstances();

        expect(instances).toContain("api1");
        expect(instances).toContain("api2");
        expect(instances.length).toBe(2);
      });

      it("retourne une liste vide quand aucune instance n'est initialisée", () => {
        expect(HttpClient.getAvailableInstances()).toEqual([]);
      });

      it("supprime toutes les instances lors de la réinitialisation globale", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        HttpClient.resetInstance();

        expect(HttpClient.getAvailableInstances()).toEqual([]);
        expect(() => HttpClient.getInstance()).toThrow(/not initialized/);
      });

      it("supprime seulement l'instance spécifiée lors d'une réinitialisation ciblée", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });

        HttpClient.resetInstance("api1");

        expect(HttpClient.getAvailableInstances()).toEqual(["api2"]);
        expect(() => HttpClient.getInstance("api1")).toThrow(/not initialized/);
        expect(HttpClient.getInstance("api2")).toBeDefined();
      });

      it("change l'instance par défaut si celle-ci est supprimée", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });
        HttpClient.setDefaultInstance("api1");

        HttpClient.resetInstance("api1");

        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api2"));
      });

      it("gère correctement la suppression de la dernière instance", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "unique",
        });

        HttpClient.resetInstance("unique");

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
      const config = { url: "/endpoint", method: "GET" };

      const result = await httpClient.request(config);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          signal: "test-signal",
        }),
      );
      expect(result).toEqual(mockResponseBody);
    });

    it("fusionne les options avec la configuration", async () => {
      const config = { url: "/endpoint", method: "POST" };
      const options = {
        headers: { Authorization: "Bearer token" },
        timeout: 15000,
      };

      await httpClient.request(config, options);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer token",
          }),
          credentials: "include",
        }),
      );
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 15000);
    });

    it("gère le remplacement de propriétés par les options", async () => {
      const config = {
        url: "/endpoint",
        method: "GET",
        headers: { "X-API-Key": "abc123" },
      };
      const options = {
        headers: { "X-API-Key": "xyz789" },
      };

      await httpClient.request(config, options);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "X-API-Key": "xyz789",
          }),
        }),
      );
    });

    it("ajoute correctement les paramètres de requête", async () => {
      const config = {
        url: "/endpoint",
        method: "GET",
        params: { filter: "active", sort: "name" },
      };

      await httpClient.request(config);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/endpoint?filter=active&sort=name",
        expect.any(Object),
      );
    });

    it("construit correctement les URLs absolues", async () => {
      const config = {
        url: "https://other-api.com/endpoint",
        method: "GET",
      };

      await httpClient.request(config);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://other-api.com/endpoint",
        expect.any(Object),
      );
    });
  });

  describe("Gestion des erreurs de requête", () => {
    beforeEach(() => {
      httpClient = createStandardHttpClient();
    });

    it("transforme les erreurs fetch en ApiRequestError", async () => {
      const fetchError = new Error("Network error");
      (global.fetch as Mock).mockRejectedValueOnce(fetchError);
      await expect(
        httpClient.request({ url: "/endpoint" }),
      ).rejects.toBeInstanceOf(ApiRequestError);
      expect(console.error).toHaveBeenCalled();
    });

    it("gère correctement les réponses HTTP non-ok", async () => {
      const errorResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Resource not found" }),
        clone: vi.fn().mockImplementation(function (this: Response) {
          return this;
        }),
      } as unknown as Response;

      (global.fetch as Mock).mockResolvedValueOnce(errorResponse);

      try {
        await httpClient.request({ url: "/nonexistent" });
        fail("La requête aurait dû échouer");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiRequestError);
      }
    });

    it("gère correctement les timeouts", async () => {
      const abortError = new DOMException(
        "The operation was aborted",
        "AbortError",
      );
      (global.fetch as Mock).mockRejectedValueOnce(abortError);

      try {
        await httpClient.request({ url: "/slow-endpoint", timeout: 5000 });
        fail("La requête aurait dû échouer avec timeout");
      } catch (error) {
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
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);

      const result = await httpClient.request({ url: "/endpoint" });
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("respecte le nombre maximum de tentatives", async () => {
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError);
      await expect(httpClient.request({ url: "/endpoint" })).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(3); // Tentative initiale + 2 retries
    });

    it("utilise un délai exponentiel entre les tentatives", async () => {
      const networkError = new Error("Network error");
      (global.fetch as Mock)
        .mockRejectedValueOnce(networkError)
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce(mockResponse);

      await httpClient.request({ url: "/endpoint" });
      expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
      expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 400);
    });

    it("réessaie les requêtes après une erreur 429", async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Rate limited" }),
        clone: vi.fn().mockImplementation(function (this: Response) {
          return this;
        }),
      } as unknown as Response;

      (global.fetch as Mock)
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(mockResponse);

      const result = await httpClient.request({ url: "/endpoint" });
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("réessaie les requêtes après une erreur 500", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Server error" }),
        clone: vi.fn().mockImplementation(function (this: Response) {
          return this;
        }),
      } as unknown as Response;

      (global.fetch as Mock)
        .mockResolvedValueOnce(serverErrorResponse)
        .mockResolvedValueOnce(mockResponse);

      const result = await httpClient.request({ url: "/endpoint" });
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockResponseBody);
    });

    it("ne réessaie pas les méthodes non idempotentes après un 500", async () => {
      const serverErrorResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({
          "content-type": "application/json",
        }),
        json: vi.fn().mockResolvedValue({ message: "Server error" }),
        clone: vi.fn().mockImplementation(function (this: Response) {
          return this;
        }),
      } as unknown as Response;

      (global.fetch as Mock).mockResolvedValueOnce(serverErrorResponse);

      try {
        await httpClient.request({
          url: "/endpoint",
          method: "POST",
          data: { test: true },
        });
        fail("La requête aurait dû échouer");
      } catch (error) {
        expect(error).toBeDefined();
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Scénarios d'utilisation avancés", () => {
    describe("Applications multi-domaines", () => {
      it("gère plusieurs instances pour différentes APIs", async () => {
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

        const mainResult = await mainApi.request({
          url: "/resources",
          method: "GET",
        });
        const authResult = await authApi.request({
          url: "/token",
          method: "POST",
        });

        expect(mainResult).toEqual(mainMockResponseBody);
        expect(authResult).toEqual(authMockResponseBody);
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenNthCalledWith(
          1,
          "https://api.example.com/resources",
          expect.any(Object),
        );
        expect(global.fetch).toHaveBeenNthCalledWith(
          2,
          "https://auth.example.com/token",
          expect.any(Object),
        );
      });

      it("permet d'accéder à la même instance depuis différents points du code", async () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api.example.com" },
          instanceName: "main",
        });
        const sameInstance = HttpClient.getInstance("main");

        const result = await sameInstance.request({
          url: "/test",
          method: "GET",
        });

        expect(result).toEqual(mockResponseBody);
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.example.com/test",
          expect.any(Object),
        );
      });

      it("gère correctement un changement d'instance par défaut", async () => {
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

        const result = await defaultInstance.request({
          url: "/test",
          method: "GET",
        });

        expect(result).toEqual(mockResponseBody);
        expect(defaultInstance).toBe(HttpClient.getInstance("api2"));
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api2.example.com/test",
          expect.any(Object),
        );
      });
    });

    describe("États spéciaux et cas limites", () => {
      it("préserve l'instance par défaut lors de la suppression d'une autre instance", () => {
        HttpClient.init({
          httpConfig: { baseURL: "https://api1.example.com" },
          instanceName: "api1",
        });
        HttpClient.init({
          httpConfig: { baseURL: "https://api2.example.com" },
          instanceName: "api2",
        });
        HttpClient.setDefaultInstance("api1");

        HttpClient.resetInstance("api2");

        expect(HttpClient.getAvailableInstances()).toEqual(["api1"]);
        expect(HttpClient.getInstance()).toBe(HttpClient.getInstance("api1"));
      });
    });
  });
});
