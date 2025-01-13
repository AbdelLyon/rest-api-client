// ClientService.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClientMock } from "./mocks/modelMocks";
import type { ActionRequest } from "@/rest-api/interfaces/action";
import type { MutateRequest } from "@/rest-api/interfaces/mutate";
import type { Client } from "@/rest-api/models/Client";
import type {
  SearchRequest,
  SearchResponse,
} from "@/rest-api/interfaces/search";
import type { AxiosInstance } from "axios";
import type { Mock } from "vitest";
import { createAxiosMock } from "@/utils/utils";
import { ClientService } from "@/rest-api/services/ClientService";

describe("ClientService", () => {
  let clientService: ClientService;
  let mockAxiosInstance: Partial<AxiosInstance>;

  beforeEach(() => {
    vi.clearAllMocks();
    ClientService.resetInstance();
    clientService = ClientService.getInstance("test", "clients");

    mockAxiosInstance = createAxiosMock();

    clientService._setAxiosInstanceForTesting(
      mockAxiosInstance as AxiosInstance,
    );
  });

  describe("Singleton Pattern", () => {
    it("devrait retourner la même instance pour des paramètres identiques", () => {
      const instance1 = ClientService.getInstance("test", "clients");
      const instance2 = ClientService.getInstance("test", "clients");

      expect(instance1).toBe(instance2);
    });

    it("devrait créer une nouvelle instance pour des paramètres différents", () => {
      ClientService.resetInstance();
      const instance1 = ClientService.getInstance("test1", "clients");
      const instance2 = ClientService.getInstance("test2", "clients");

      expect(instance1).not.toBe(instance2);
    });

    it("devrait permettre de réinitialiser l'instance", () => {
      const instance1 = ClientService.getInstance("test", "clients");
      ClientService.resetInstance();
      const instance2 = ClientService.getInstance("test", "clients");

      expect(instance1).not.toBe(instance2);
    });
  });

  describe("Search Method", () => {
    it("devrait effectuer une recherche", async () => {
      const searchRequest: SearchRequest = {
        page: 1,
        limit: 10,
        filters: [{ field: "country_alpha", operator: "=", value: "FR" }],
      };

      const mockSearchResponse: SearchResponse<Client> = {
        data: [
          {
            id: 1,
            is_demo_accessible: false,
            name: "ADMINISTRATEUR XEFI",
            number_managers_can_validate: 2,
            referred_by: null,
            siret: "12569845698563",
            client_id: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            country_alpha: "FR",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        meta: {
          page: 1,
          perPage: 10,
          total: 1,
        },
      };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockSearchResponse,
      });

      const result = await clientService.search(searchRequest);

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
      const mutateRequest: Array<MutateRequest> = [
        {
          operation: "create",
          attributes: {
            name: "Nouveau Client",
            is_demo_accessible: true,
            number_managers_can_validate: 1,
            siret: "98765432100",
            country_alpha: "FR",
          },
        },
      ];

      const mockMutateResponse = {
        data: [
          {
            id: 2,
            name: "Nouveau Client",
            is_demo_accessible: true,
            number_managers_can_validate: 1,
            referred_by: null,
            siret: "98765432100",
            client_id: "new-client-uuid",
            country_alpha: "FR",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockMutateResponse,
      });

      const result = await clientService.mutate(mutateRequest);

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
          fields: [
            { name: "is_demo_accessible", value: true },
            { name: "number_managers_can_validate", value: 3 },
          ],
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

      const result = await clientService.executeAction(actionRequest);

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

      await expect(clientService.search(searchRequest)).rejects.toThrow();
    });
  });

  describe("Custom Request Method", () => {
    it("devrait effectuer une requête personnalisée", async () => {
      const mockResponse = { data: "custom result" };

      (mockAxiosInstance.request as Mock).mockResolvedValue({
        data: mockResponse,
      });

      const mockClient = createClientMock();

      const result = await clientService.customRequest(
        "GET",
        "/custom-endpoint",

        { ...mockClient },
      );

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/custom-endpoint",
          data: mockClient,
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
