// // UserTestService.test.ts
// import { beforeEach, describe, expect, it, vi } from "vitest";
// import { UserTestService } from "./services/QueryTestService";
// import type { Mock } from "vitest";
// import type {
//   Filter,
//   Gate,
//   Include,
//   Instruction,
//   SearchRequest,
//   Select,
//   Sort,
// } from "@/rest-api/types/search";
// import type { AxiosInstance } from "axios";
// import {
//   createSearchResponseMock,
//   createUserWithMultipleApplications,
// } from "@/tests/mocks/modelMocks";
// import { createAxiosMock } from "@/utils/utils";

// describe("QueryService", () => {
//   let queryService: UserTestService;
//   let mockAxiosInstance: Partial<AxiosInstance>;

//   beforeEach(() => {
//     vi.clearAllMocks();
//     UserTestService.resetInstance();
//     queryService = UserTestService.getInstance("test", "users");
//     mockAxiosInstance = createAxiosMock();
//     queryService._setAxiosInstanceForTesting(
//       mockAxiosInstance as AxiosInstance,
//     );
//   });

//   describe("Singleton Pattern", () => {
//     it("devrait retourner la même instance pour des paramètres identiques", () => {
//       const instance1 = UserTestService.getInstance("test", "users");
//       const instance2 = UserTestService.getInstance("test", "users");
//       expect(instance1).toBe(instance2);
//     });

//     it("devrait créer une nouvelle instance pour des paramètres différents", () => {
//       UserTestService.resetInstance();
//       const instance1 = UserTestService.getInstance("test1", "users");
//       const instance2 = UserTestService.getInstance("test2", "users");
//       expect(instance1).not.toBe(instance2);
//     });

//     it("devrait permettre de réinitialiser l'instance", () => {
//       const instance1 = UserTestService.getInstance("test", "users");
//       UserTestService.resetInstance();
//       const instance2 = UserTestService.getInstance("test", "users");
//       expect(instance1).not.toBe(instance2);
//     });
//   });

//   describe("Search Method", () => {
//     describe("Basic Search", () => {
//       it("devrait effectuer une recherche simple", async () => {
//         const searchRequest: SearchRequest = {
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         const result = await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//         expect(result).toEqual(mockSearchResponse);
//       });
//     });

//     describe("Advanced Search Capabilities", () => {
//       it("devrait supporter des filtres simples", async () => {
//         const filters: Array<Filter> = [
//           { field: "email", operator: "=", value: "test@example.com" },
//         ];

//         const searchRequest: SearchRequest = {
//           filters,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });

//       it("devrait supporter des filtres imbriqués", async () => {
//         const filters: Array<Filter> = [
//           {
//             nested: [
//               { field: "email", operator: "=", value: "test@example.com" },
//               { field: "firstname", operator: "=", value: "John", type: "and" },
//             ],
//           },
//         ];

//         const searchRequest: SearchRequest = {
//           filters,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });

//       it("devrait supporter le tri", async () => {
//         const sorts: Array<Sort> = [
//           { field: "lastname", direction: "asc" },
//           { field: "created_at", direction: "desc" },
//         ];

//         const searchRequest: SearchRequest = {
//           sorts,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });

//       it("devrait supporter la sélection de champs", async () => {
//         const selects: Array<Select> = [
//           { field: "id" },
//           { field: "email" },
//           { field: "firstname" },
//         ];

//         const searchRequest: SearchRequest = {
//           selects,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });

//       it("devrait supporter les inclusions", async () => {
//         const includes: Array<Include> = [
//           {
//             relation: "applications",
//             filters: [
//               { field: "is_under_maintenance", operator: "=", value: false },
//             ],
//             limit: 3,
//           },
//         ];

//         const searchRequest: SearchRequest = {
//           includes,
//           page: 1,
//           limit: 10,
//         };

//         const userWithApplications = createUserWithMultipleApplications(3);
//         const mockSearchResponse = createSearchResponseMock([
//           userWithApplications,
//         ]);

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         const result = await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//         expect(result.data[0].applications).toHaveLength(3);
//       });

//       it("devrait supporter les instructions", async () => {
//         const instructions: Array<Instruction> = [
//           {
//             name: "custom_filter",
//             fields: [
//               { name: "active", value: true },
//               { name: "role", value: "admin" },
//             ],
//           },
//         ];

//         const searchRequest: SearchRequest = {
//           instructions,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });

//       it("devrait supporter les gates", async () => {
//         const gates: Array<Gate> = ["view", "update"];

//         const searchRequest: SearchRequest = {
//           gates,
//           page: 1,
//           limit: 10,
//         };

//         const mockSearchResponse = createSearchResponseMock();

//         (mockAxiosInstance.request as Mock).mockResolvedValue({
//           data: mockSearchResponse,
//         });

//         await queryService.searchPaginate(searchRequest);

//         expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//           expect.objectContaining({
//             method: "POST",
//             url: "/search",
//             data: { search: searchRequest },
//           }),
//         );
//       });
//     });
//   });

//   describe("Error Handling", () => {
//     it("devrait gérer les erreurs de requête", async () => {
//       const searchRequest: SearchRequest = { page: 1, limit: 10 };
//       const mockError = new Error("Network error");

//       (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

//       await expect(
//         queryService.searchPaginate(searchRequest),
//       ).rejects.toThrow();
//     });

//     it("devrait contenir l'erreur originale dans ApiServiceError", async () => {
//       const searchRequest: SearchRequest = { page: 1, limit: 10 };
//       const mockError = new Error("Network error");

//       (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

//       try {
//         await queryService.searchPaginate(searchRequest);
//       } catch (error: unknown) {
//         expect((error as { name: string }).name).toBe("ApiServiceError");
//         expect((error as { originalError: Error }).originalError).toBe(
//           mockError,
//         );
//       }
//     });
//   });
// });
