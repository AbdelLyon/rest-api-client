// SiteService.test.ts
import type { Mock } from "vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { AxiosInstance } from "axios";
import { SiteService } from "@/rest-api/services/SiteService";
import type {
  SearchRequest,
  Filter,
  Include,
} from "@/rest-api/interfaces/search";
import { createAxiosMock } from "@/utils/utils";
import {
  createSiteMock,
  createSearchResponseMock,
} from "@/tests/mocks/modelMocks";
import type { Site } from "@/rest-api/models/Site";
import type { MutateRequest } from "@/rest-api/interfaces/mutate";
import type { ActionRequest } from "@/rest-api/interfaces/action";

describe("SiteService", () => {
  let siteService: SiteService;
  let mockAxiosInstance: Partial<AxiosInstance>;

  beforeEach(() => {
    vi.clearAllMocks();
    SiteService.resetInstance();
    siteService = SiteService.getInstance("test", "sites");
    mockAxiosInstance = createAxiosMock();
    siteService._setAxiosInstanceForTesting(mockAxiosInstance as AxiosInstance);
  });

  describe("Singleton Pattern", () => {
    it("devrait retourner la même instance pour des paramètres identiques", () => {
      const instance1 = SiteService.getInstance("test", "sites");
      const instance2 = SiteService.getInstance("test", "sites");
      expect(instance1).toBe(instance2);
    });

    it("devrait créer une nouvelle instance pour des paramètres différents", () => {
      SiteService.resetInstance();
      const instance1 = SiteService.getInstance("test1", "sites");
      const instance2 = SiteService.getInstance("test2", "sites");
      expect(instance1).not.toBe(instance2);
    });

    it("devrait permettre de réinitialiser l'instance", () => {
      const instance1 = SiteService.getInstance("test", "sites");
      SiteService.resetInstance();
      const instance2 = SiteService.getInstance("test", "sites");
      expect(instance1).not.toBe(instance2);
    });
  });

  describe("Search Method", () => {
    describe("Basic Search", () => {
      it("devrait effectuer une recherche simple", async () => {
        const searchRequest: SearchRequest = {
          page: 1,
          limit: 10,
        };

        const mockSearchResponse = createSearchResponseMock<Site>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        const result = await siteService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
        expect(result).toEqual(mockSearchResponse);
      });
    });

    describe("Advanced Search Capabilities", () => {
      it("devrait supporter des filtres géographiques", async () => {
        const filters: Filter[] = [
          { field: "country_alpha", operator: "=", value: "FR" },
          { field: "city", operator: "=", value: "Paris" },
        ];

        const searchRequest: SearchRequest = {
          filters,
          page: 1,
          limit: 10,
        };

        const mockSearchResponse = createSearchResponseMock<Site>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        await siteService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
      });

      it("devrait supporter des filtres sur le client", async () => {
        const filters: Filter[] = [
          { field: "client.name", operator: "=", value: "Xefi" },
          { field: "timezone", operator: "=", value: "Europe/Paris" },
        ];

        const searchRequest: SearchRequest = {
          filters,
          page: 1,
          limit: 10,
        };

        const mockSearchResponse = createSearchResponseMock<Site>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        await siteService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
      });

      it("devrait supporter les inclusions de client", async () => {
        const includes: Include[] = [
          {
            relation: "client",
            filters: [
              { field: "is_demo_accessible", operator: "=", value: false },
            ],
            limit: 3,
          },
        ];

        const searchRequest: SearchRequest = {
          includes,
          page: 1,
          limit: 10,
        };

        const siteWithClient = createSiteMock({
          client: {
            id: "client1",
            name: "Test Client",
            is_demo_accessible: false,
            number_managers_can_validate: 2,
            referred_by: null,
            siret: "12345678901234",
            client_id: "client1",
            country_alpha: "FR",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });

        const mockSearchResponse = createSearchResponseMock([siteWithClient]);

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        const result = await siteService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
        expect(result.data[0].client).toBeDefined();
      });
    });
  });

  describe("Mutate Method", () => {
    it("devrait effectuer des mutations", async () => {
      const mutateRequest: MutateRequest[] = [
        {
          operation: "create",
          attributes: {
            name: "New Site",
            client_id: "client1",
            country_alpha: "FR",
            city: "Lyon",
            timezone: "Europe/Paris",
          },
        },
      ];

      const mockMutateResponse = createSearchResponseMock<Site>();

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockMutateResponse,
      });

      const result = await siteService.mutate(mutateRequest);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/mutate",
          data: { mutate: mutateRequest },
        }),
      );
      expect(result).toEqual(mockMutateResponse);
    });
  });

  describe("Execute Action Method", () => {
    it("devrait exécuter une action", async () => {
      const actionRequest: ActionRequest = {
        action: "update_timezone",
        params: {
          fields: [{ name: "timezone", value: "Europe/London" }],
          search: {
            filters: [{ field: "id", value: "site1" }],
          },
        },
      };

      const mockActionResponse = {
        success: true,
        data: { updated: 1 },
      };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockActionResponse,
      });

      const result = await siteService.executeAction(actionRequest);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/actions/update_timezone",
          data: actionRequest.params,
        }),
      );
      expect(result).toEqual(mockActionResponse);
    });
  });

  describe("Error Handling", () => {
    it("devrait gérer les erreurs de requête", async () => {
      const searchRequest: SearchRequest = { page: 1, limit: 10 };
      const mockError = new Error("Network error");

      (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

      await expect(siteService.search(searchRequest)).rejects.toThrow();
    });

    it("devrait contenir l'erreur originale dans ApiServiceError", async () => {
      const searchRequest: SearchRequest = { page: 1, limit: 10 };
      const mockError = new Error("Network error");

      (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

      try {
        await siteService.search(searchRequest);
      } catch (error: unknown) {
        expect((error as { name: string }).name).toBe("ApiServiceError");
        expect((error as { originalError: Error }).originalError).toBe(
          mockError,
        );
      }
    });
  });

  describe("Custom Request Method", () => {
    it("devrait effectuer une requête personnalisée", async () => {
      const mockResponse = { data: "custom result" };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockResponse,
      });

      const mockSite = createSiteMock();
      const result = await siteService.customRequest(
        "GET",
        "/custom-endpoint",
        mockSite,
      );

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/custom-endpoint",
          data: mockSite,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
