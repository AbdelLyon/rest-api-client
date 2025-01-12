// RoleService.test.ts
import type { Mock } from "vitest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { AxiosInstance } from "axios";
import type {
  SearchRequest,
  SearchResponse,
} from "@/rest-api/interfaces/search";
import type { Role } from "@/rest-api/models/User";
import type { MutateRequest } from "@/rest-api/interfaces/mutate";
import type { ActionRequest } from "@/rest-api/interfaces/action";
import { createAxiosMock } from "@/utils/utils";
import { RoleService } from "@/rest-api/services/RoleService";
import { createRoleMock } from "./mocks/modelMocks";

describe("RoleService", () => {
  let roleService: RoleService;
  let mockAxiosInstance: Partial<AxiosInstance>;

  beforeEach(() => {
    vi.clearAllMocks();
    RoleService.resetInstance();
    roleService = RoleService.getInstance("test", "roles");

    mockAxiosInstance = createAxiosMock();

    roleService._setAxiosInstanceForTesting(mockAxiosInstance as AxiosInstance);
  });

  describe("Singleton Pattern", () => {
    it("devrait retourner la même instance pour des paramètres identiques", () => {
      const instance1 = RoleService.getInstance("test", "roles");
      const instance2 = RoleService.getInstance("test", "roles");

      expect(instance1).toBe(instance2);
    });

    it("devrait créer une nouvelle instance pour des paramètres différents", () => {
      RoleService.resetInstance();
      const instance1 = RoleService.getInstance("test1", "roles");
      const instance2 = RoleService.getInstance("test2", "roles");

      expect(instance1).not.toBe(instance2);
    });

    it("devrait permettre de réinitialiser l'instance", () => {
      const instance1 = RoleService.getInstance("test", "roles");
      RoleService.resetInstance();
      const instance2 = RoleService.getInstance("test", "roles");

      expect(instance1).not.toBe(instance2);
    });
  });

  describe("Search Method", () => {
    it("devrait effectuer une recherche", async () => {
      const searchRequest: SearchRequest = {
        page: 1,
        limit: 10,
        filters: [{ field: "guard_name", operator: "=", value: "api" }],
      };

      const mockSearchResponse: SearchResponse<Role> = {
        data: [
          {
            id: 1,
            name: "Xefi Admin",
            guard_name: "api",
            translate_name: "Xefi Admin",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Admin",
            guard_name: "api",
            translate_name: "Administrateur",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        meta: {
          page: 1,
          perPage: 10,
          total: 2,
        },
      };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockSearchResponse,
      });

      const result = await roleService.search(searchRequest);

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

  describe("Mutate Method", () => {
    it("devrait effectuer des mutations", async () => {
      const mutateRequest: MutateRequest[] = [
        {
          operation: "create",
          attributes: {
            name: "Support",
            guard_name: "api",
            translate_name: "Support Technique",
          },
        },
      ];

      const mockMutateResponse = {
        data: [
          {
            id: 7,
            name: "Support",
            guard_name: "api",
            translate_name: "Support Technique",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockMutateResponse,
      });

      const result = await roleService.mutate(mutateRequest);

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
        action: "update",
        params: {
          fields: [{ name: "translate_name", value: "Nouveau Nom" }],
          search: {
            filters: [{ field: "id", value: 1 }],
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

      const result = await roleService.executeAction(actionRequest);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: "/actions/update",
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

      await expect(roleService.search(searchRequest)).rejects.toThrow();
    });
  });

  describe("Custom Request Method", () => {
    it("devrait effectuer une requête personnalisée", async () => {
      const mockResponse = { data: "custom result" };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockResponse,
      });

      const mockRoles = createRoleMock();
      const result = await roleService.customRequest(
        "GET",
        "/custom-endpoint",
        {
          ...mockRoles,
        },
      );

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/custom-endpoint",
          data: mockRoles,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
