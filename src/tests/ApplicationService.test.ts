// ApplicationService.test.ts
import type { Mock } from "vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { AxiosInstance } from "axios";
import type {
  SearchRequest,
  Filter,
  Include,
} from "@/rest-api/interfaces/search";
import type { Application } from "@/rest-api/models/Application";
import { createAxiosMock } from "@/utils/utils";
import {
  createApplicationMock,
  createSearchResponseMock,
} from "@/tests/mocks/modelMocks";
import { ApplicationService } from "@/rest-api/services/Application";
import type { MutateRequest } from "@/rest-api/interfaces/mutate";
import type { ActionRequest } from "@/rest-api/interfaces/action";

describe("ApplicationService", () => {
  let applicationService: ApplicationService;
  let mockAxiosInstance: Partial<AxiosInstance>;

  beforeEach(() => {
    vi.clearAllMocks();
    ApplicationService.resetInstance();
    applicationService = ApplicationService.getInstance("test", "applications");
    mockAxiosInstance = createAxiosMock();
    applicationService._setAxiosInstanceForTesting(
      mockAxiosInstance as AxiosInstance,
    );
  });

  describe("Singleton Pattern", () => {
    it("devrait retourner la même instance pour des paramètres identiques", () => {
      const instance1 = ApplicationService.getInstance("test", "applications");
      const instance2 = ApplicationService.getInstance("test", "applications");
      expect(instance1).toBe(instance2);
    });

    it("devrait créer une nouvelle instance pour des paramètres différents", () => {
      ApplicationService.resetInstance();
      const instance1 = ApplicationService.getInstance("test1", "applications");
      const instance2 = ApplicationService.getInstance("test2", "applications");
      expect(instance1).not.toBe(instance2);
    });

    it("devrait permettre de réinitialiser l'instance", () => {
      const instance1 = ApplicationService.getInstance("test", "applications");
      ApplicationService.resetInstance();
      const instance2 = ApplicationService.getInstance("test", "applications");
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

        const mockSearchResponse = createSearchResponseMock<Application>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        const result = await applicationService.search(searchRequest);

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
      it("devrait supporter des filtres sur maintenance", async () => {
        const filters: Filter[] = [
          { field: "is_under_maintenance", operator: "=", value: false },
          { field: "has_mobile_application", operator: "=", value: true },
        ];

        const searchRequest: SearchRequest = {
          filters,
          page: 1,
          limit: 10,
        };

        const mockSearchResponse = createSearchResponseMock<Application>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        await applicationService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
      });

      it("devrait supporter des filtres sur pack et slug", async () => {
        const filters: Filter[] = [
          { field: "pack.name", operator: "=", value: "Mobile Apps" },
          { field: "slug", operator: "=", value: "mobile-app" },
        ];

        const searchRequest: SearchRequest = {
          filters,
          page: 1,
          limit: 10,
        };

        const mockSearchResponse = createSearchResponseMock<Application>();

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        await applicationService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
      });

      it("devrait supporter les inclusions de profiles", async () => {
        const includes: Include[] = [
          {
            relation: "profiles",
            filters: [{ field: "is_visible", operator: "=", value: true }],
            limit: 3,
          },
        ];

        const searchRequest: SearchRequest = {
          includes,
          page: 1,
          limit: 10,
        };

        const applicationWithProfiles = createApplicationMock({
          profiles: [
            {
              id: "profile1",
              label: "Admin Profile",
              is_visible: 1,
              translate_label: "Administrateur",
              application_id: "app1",
              application: createApplicationMock(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        });

        const mockSearchResponse = createSearchResponseMock([
          applicationWithProfiles,
        ]);

        (mockAxiosInstance.request as Mock).mockResolvedValue({
          data: mockSearchResponse,
        });

        const result = await applicationService.search(searchRequest);

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: "POST",
            url: "/search",
            data: { search: searchRequest },
          }),
        );
        expect(result.data[0].profiles).toHaveLength(1);
      });
    });
  });

  describe("Mutate Method", () => {
    it("devrait effectuer des mutations", async () => {
      const mutateRequest: MutateRequest[] = [
        {
          operation: "create",
          attributes: {
            name: "New Application",
            slug: "new-app",
            url: "https://newapp.com",
          },
        },
      ];

      const mockMutateResponse = createSearchResponseMock<Application>();

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockMutateResponse,
      });

      const result = await applicationService.mutate(mutateRequest);

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
        action: "update_maintenance",
        params: {
          fields: [{ name: "is_under_maintenance", value: true }],
          search: {
            filters: [{ field: "id", value: "app1" }],
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

      const result = await applicationService.executeAction(actionRequest);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/actions/update_maintenance",
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

      await expect(applicationService.search(searchRequest)).rejects.toThrow();
    });

    it("devrait contenir l'erreur originale dans ApiServiceError", async () => {
      const searchRequest: SearchRequest = { page: 1, limit: 10 };
      const mockError = new Error("Network error");

      (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

      try {
        await applicationService.search(searchRequest);
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

      const mockApplications = createApplicationMock();

      const result = await applicationService.customRequest(
        "GET",
        "/custom-endpoint",
        { ...mockApplications },
      );

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/custom-endpoint",
          data: mockApplications,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
