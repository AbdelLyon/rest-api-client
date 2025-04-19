import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { z } from "zod";

import type {
  DetailsResponse,
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
} from "@/query";
import { ApiRequestError } from "@/error/ApiRequestError";
import { Query } from "@/query";
import { HttpClient } from "@/http";

const TestResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

type TestResource = z.infer<typeof TestResourceSchema>;

class TestQuery extends Query<TestResource> {
  constructor(pathname: string) {
    super(pathname, TestResourceSchema);
  }
}

describe("Query avec Zod", () => {
  const pathname = "/api/resources";
  let query: TestQuery;
  const mockRequest = vi.fn();

  beforeAll(() => {
    HttpClient.init({
      httpConfig: {
        baseURL: "https://api.test.com",
      },
      instanceName: "main",
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Espionner les méthodes que nous voulons tester
    vi.spyOn(HttpClient, "getInstance");
    vi.spyOn(console, "error").mockImplementation(() => {});

    // Remplacer la méthode request par un mock
    const httpInstance = HttpClient.getInstance();
    vi.spyOn(httpInstance, "request").mockImplementation(mockRequest);

    // Créer une nouvelle instance de TestQuery pour chaque test
    query = new TestQuery(pathname);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    HttpClient.resetInstance();
  });

  describe("Constructor", () => {
    it("devrait initialiser correctement les propriétés avec le pathname et le schéma", () => {
      expect(HttpClient.getInstance).toHaveBeenCalled();
      expect(query["pathname"]).toBe(pathname);
      expect(query["schema"]).toBe(TestResourceSchema);
      expect(query["http"]).toBe(HttpClient.getInstance());
    });

    it("devrait lancer une erreur si HttpClient n'est pas initialisé", () => {
      // Simuler que HttpClient.getInstance lance une erreur
      vi.spyOn(HttpClient, "getInstance").mockImplementationOnce(() => {
        throw new Error("Http not initialized. Call Http.init() first.");
      });

      expect(() => new TestQuery("/api/other")).toThrow("Http not initialized");
    });
  });

  describe("validateData", () => {
    it("devrait valider et retourner des données correctes", () => {
      const validData = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        {
          id: 2,
          name: "Resource 2",
          status: "inactive",
          createdAt: "2023-01-02",
        },
      ];

      const validateData = query["validateData"].bind(query);
      const result = validateData(validData);

      expect(result).toEqual(validData);
      expect(console.error).not.toHaveBeenCalled();
    });

    it("devrait rejeter les données avec un type incorrect", () => {
      const invalidData = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        { id: "2", name: 123, status: true, createdAt: null }, // Types incorrects
      ];

      const validateData = query["validateData"].bind(query);

      expect(() => validateData(invalidData)).toThrow("Type validation failed");
      expect(console.error).toHaveBeenCalled();
    });

    it("devrait rejeter les données avec des propriétés manquantes", () => {
      const invalidData = [
        { id: 1, name: "Resource 1" }, // Manque status et createdAt
        { id: 2, status: "active" }, // Manque name et createdAt
      ];

      const validateData = query["validateData"].bind(query);

      expect(() => validateData(invalidData)).toThrow("Type validation failed");
      expect(console.error).toHaveBeenCalled();
    });

    it("devrait gérer un tableau vide", () => {
      const validateData = query["validateData"].bind(query);
      const result = validateData([]);

      expect(result).toEqual([]);
    });

    it("devrait convertir les données si le schéma le permet", () => {
      // Créer un schéma qui permet la conversion (par exemple, string -> number)
      const schemaWithConversion = z.object({
        id: z.coerce.number(), // Convertit automatiquement les strings en numbers
        value: z.string(),
      });

      // Créer une query avec ce schéma
      class ConversionQuery extends Query<
        z.infer<typeof schemaWithConversion>
      > {
        constructor() {
          super("/api/convert", schemaWithConversion);
        }
      }

      const conversionQuery = new ConversionQuery();
      const validateData =
        conversionQuery["validateData"].bind(conversionQuery);

      const dataToConvert = [
        { id: "123", value: "test" }, // id est une string mais sera convertie en number
        { id: 456, value: "another" },
      ];

      const result = validateData(dataToConvert);

      expect(result).toEqual([
        { id: 123, value: "test" },
        { id: 456, value: "another" },
      ]);
    });
  });

  describe("searchRequest (méthode privée)", () => {
    it("devrait construire et envoyer correctement la requête de recherche", async () => {
      const mockResponse: SearchResponse<TestResource> = {
        data: [
          {
            id: 1,
            name: "Resource 1",
            status: "active",
            createdAt: "2023-01-01",
          },
        ],
        meta: {
          page: 1,
          perPage: 10,
          total: 1,
        },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchRequest = query["searchRequest"].bind(query);
      const searchParams: SearchRequest = {
        filters: [
          {
            field: "name",
            operator: "in",
            value: ["Resource 1", "Resource 2"],
          },
        ],
      };

      const result = await searchRequest(searchParams);

      expect(mockRequest).toHaveBeenCalledWith(
        {
          method: "POST",
          url: `${pathname}/search`,
          data: { search: searchParams },
        },
        {},
      );
      expect(result).toEqual(mockResponse);
    });

    it("devrait transmettre les options supplémentaires à la requête", async () => {
      const mockResponse: SearchResponse<TestResource> = {
        data: [],
        meta: { page: 1, perPage: 10, total: 0 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchRequest = query["searchRequest"].bind(query);
      const searchParams: SearchRequest = { filters: [] };
      const options = {
        headers: { Authorization: "Bearer token" },
        timeout: 5000,
      };

      await searchRequest(searchParams, options);

      expect(mockRequest).toHaveBeenCalledWith(
        {
          method: "POST",
          url: `${pathname}/search`,
          data: { search: searchParams },
        },
        options,
      );
    });

    it("devrait gérer les erreurs HTTP correctement", async () => {
      const error = new ApiRequestError({ message: "Network error" } as any, {
        url: `${pathname}/search`,
      });

      mockRequest.mockRejectedValueOnce(error);

      const searchRequest = query["searchRequest"].bind(query);
      const searchParams: SearchRequest = { filters: [] };

      await expect(searchRequest(searchParams)).rejects.toThrow(error);
    });
  });

  describe("search", () => {
    it("devrait appeler searchRequest, valider et retourner les données", async () => {
      const mockData: Array<TestResource> = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        {
          id: 2,
          name: "Resource 2",
          status: "active",
          createdAt: "2023-01-02",
        },
      ];

      const mockResponse: SearchResponse<TestResource> = {
        data: mockData,
        meta: {
          page: 1,
          perPage: 10,
          total: 2,
        },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      // Espionner les méthodes privées
      const searchRequestSpy = vi.spyOn(query as any, "searchRequest");
      const validateDataSpy = vi.spyOn(query as any, "validateData");

      // Filtre simple
      const searchParams: SearchRequest = {
        filters: [{ field: "status", operator: "=", value: "active" }],
      };

      const result = await query.search(searchParams);

      expect(searchRequestSpy).toHaveBeenCalledWith(searchParams, {});
      expect(validateDataSpy).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });

    it("devrait transmettre les options à searchRequest", async () => {
      const mockData: Array<TestResource> = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
      ];

      const mockResponse: SearchResponse<TestResource> = {
        data: mockData,
        meta: { page: 1, perPage: 10, total: 1 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchRequestSpy = vi.spyOn(query as any, "searchRequest");

      const searchParams: SearchRequest = { filters: [] };
      const options = { headers: { "X-Custom": "value" } };

      await query.search(searchParams, options);

      expect(searchRequestSpy).toHaveBeenCalledWith(searchParams, options);
    });

    it("devrait propager les erreurs de validation", async () => {
      const invalidData = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        { id: "2", name: 123, status: true }, // Données invalides
      ];

      const mockResponse: SearchResponse<any> = {
        data: invalidData,
        meta: { page: 1, perPage: 10, total: 2 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchParams: SearchRequest = {
        filters: [{ field: "status", operator: "=", value: "active" }],
      };

      await expect(query.search(searchParams)).rejects.toThrow(
        "Type validation failed",
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("devrait propager les erreurs de requête HTTP", async () => {
      const error = new Error("Request failed");
      mockRequest.mockRejectedValueOnce(error);

      await expect(query.search({ filters: [] })).rejects.toThrow(
        "Request failed",
      );
    });
  });

  describe("searchPaginate", () => {
    it("devrait appeler searchRequest, valider les données et retourner la réponse paginée", async () => {
      const mockData: Array<TestResource> = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        {
          id: 2,
          name: "Resource 2",
          status: "active",
          createdAt: "2023-01-02",
        },
      ];

      const mockResponse: SearchResponse<TestResource> = {
        data: mockData,
        meta: {
          page: 2,
          perPage: 2,
          total: 10,
        },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchRequestSpy = vi.spyOn(query as any, "searchRequest");
      const validateDataSpy = vi.spyOn(query as any, "validateData");

      const paginatedRequest: PaginatedSearchRequest = {
        filters: [{ field: "status", operator: "=", value: "active" }],
        page: 2,
        limit: 2,
      };

      const result = await query.searchPaginate(paginatedRequest);

      expect(searchRequestSpy).toHaveBeenCalledWith(paginatedRequest, {});
      expect(validateDataSpy).toHaveBeenCalledWith(mockData);
      expect(result.data).toEqual(mockData);
      expect(result.meta).toEqual(mockResponse.meta);
    });

    it("devrait transmettre les options à searchRequest", async () => {
      const mockData: Array<TestResource> = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
      ];

      const mockResponse: SearchResponse<TestResource> = {
        data: mockData,
        meta: { page: 1, perPage: 10, total: 1 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const searchRequestSpy = vi.spyOn(query as any, "searchRequest");

      const paginatedRequest: PaginatedSearchRequest = {
        filters: [],
        page: 1,
        limit: 10,
      };
      const options = { headers: { "X-Custom": "value" } };

      await query.searchPaginate(paginatedRequest, options);

      expect(searchRequestSpy).toHaveBeenCalledWith(paginatedRequest, options);
    });

    it("devrait propager les erreurs de validation dans searchPaginate", async () => {
      const invalidData = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
        { id: "2", name: 123, status: true },
      ];

      const mockResponse: SearchResponse<any> = {
        data: invalidData,
        meta: { page: 1, perPage: 10, total: 2 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const paginatedRequest: PaginatedSearchRequest = {
        filters: [],
        page: 1,
        limit: 10,
      };

      await expect(query.searchPaginate(paginatedRequest)).rejects.toThrow(
        "Type validation failed",
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("devrait maintenir la structure de réponse paginée même avec un tableau vide", async () => {
      const mockResponse: SearchResponse<TestResource> = {
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          total: 0,
        },
      };

      mockRequest.mockResolvedValueOnce(mockResponse);

      const paginatedRequest: PaginatedSearchRequest = {
        filters: [{ field: "status", operator: "=", value: "nonexistent" }],
        page: 1,
        limit: 10,
      };

      const result = await query.searchPaginate(paginatedRequest);

      expect(result.data).toEqual([]);
      expect(result.meta).toEqual(mockResponse.meta);
    });
  });

  describe("getdetails", () => {
    it("devrait effectuer une requête GET et retourner les détails de la ressource", async () => {
      const mockDetailsResponse: DetailsResponse = {
        data: {
          actions: [
            {
              name: "Create",
              uriKey: "create",
              fields: { name: ["required", "string"] },
              meta: { color: "green" },
              is_standalone: true,
            },
          ],
          instructions: [],
          fields: ["id", "name", "status"],
          limits: [10, 25, 50],
          scopes: ["recent", "active"],
          relations: [],
          rules: {
            all: {
              name: ["required", "string"],
            },
          },
        },
      };

      mockRequest.mockResolvedValueOnce(mockDetailsResponse);

      const result = await query.getdetails();

      expect(mockRequest).toHaveBeenCalledWith(
        {
          method: "GET",
          url: pathname,
        },
        {},
      );
      expect(result).toEqual(mockDetailsResponse);
    });

    it("devrait transmettre les options à la requête HTTP", async () => {
      const mockDetailsResponse: DetailsResponse = {
        data: {
          actions: [],
          instructions: [],
          fields: [],
          limits: [],
          scopes: [],
          relations: [],
          rules: {},
        },
      };

      mockRequest.mockResolvedValueOnce(mockDetailsResponse);

      const options = {
        headers: { Authorization: "Bearer token" },
      };

      await query.getdetails(options);

      expect(mockRequest).toHaveBeenCalledWith(
        {
          method: "GET",
          url: pathname,
        },
        options,
      );
    });

    it("devrait propager les erreurs de requête HTTP", async () => {
      const error = new Error("Failed to fetch details");
      mockRequest.mockRejectedValueOnce(error);

      await expect(query.getdetails()).rejects.toThrow(
        "Failed to fetch details",
      );
    });
  });

  describe("Intégration des composants", () => {
    it("devrait fonctionner de bout en bout avec des données valides", async () => {
      const mockData: Array<TestResource> = [
        {
          id: 1,
          name: "Resource 1",
          status: "active",
          createdAt: "2023-01-01",
        },
      ];

      const mockResponse: SearchResponse<TestResource> = {
        data: mockData,
        meta: { page: 1, perPage: 10, total: 1 },
      };

      mockRequest.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({
        data: {
          actions: [],
          instructions: [],
          fields: ["id", "name", "status", "createdAt"],
          limits: [10],
          scopes: [],
          relations: [],
          rules: {},
        },
      });

      const searchResult = await query.search({
        filters: [{ field: "status", operator: "=", value: "active" }],
      });

      const detailsResult = await query.getdetails();

      expect(searchResult).toEqual(mockData);
      expect(detailsResult.data.fields).toContain("name");
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
