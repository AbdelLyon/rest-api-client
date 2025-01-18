// // MutationService.test.ts
// import { beforeEach, describe, expect, it, vi } from "vitest";

// import { MutationTestService } from "./services/MutationTestService";
// import type { Mock } from "vitest";

// import type { AxiosInstance } from "axios";
// import type { ActionRequest, MutateRequest } from "@/rest-api/types";
// import { createSearchResponseMock } from "@/tests/mocks/modelMocks";
// import { createAxiosMock } from "@/utils/utils";

// interface UserAttributes {
//   firstname: string;
//   lastname: string;
//   email: string;
// }

// interface ApplicationAttributes {
//   name: string;
//   domain: string;
// }

// interface UserRelations {
//   applications: ApplicationAttributes;
//   profiles: unknown;
// }

// type UserRelationAttributesMap = {
//   applications: ApplicationAttributes;
//   profiles: unknown;
// };

// describe("MutationService", () => {
//   let mutationService: MutationTestService;
//   let mockAxiosInstance: Partial<AxiosInstance>;

//   beforeEach(() => {
//     vi.clearAllMocks();
//     MutationTestService.resetInstance();
//     mutationService = MutationTestService.getInstance("users");
//     mockAxiosInstance = createAxiosMock();
//     mutationService._setAxiosInstanceForTesting(
//       mockAxiosInstance as AxiosInstance,
//     );
//   });

//   describe("Mutate Method", () => {
//     it("devrait effectuer une mutation de création simple", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "create",
//             attributes: {
//               firstname: "John",
//               lastname: "Doe",
//               email: "john@example.com",
//             },
//           },
//         ],
//       };

//       const mockMutateResponse = createSearchResponseMock();
//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockMutateResponse,
//       });

//       const result = await mutationService.mutate(mutateRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/mutate",
//           data: mutateRequest,
//         }),
//       );
//       expect(result).toEqual(mockMutateResponse);
//     });

//     it("devrait effectuer une mutation de mise à jour", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "update",
//             key: 1,
//             attributes: {
//               firstname: "John Updated",
//               lastname: "majax",
//               email: "john.updated@example.com",
//             },
//           },
//         ],
//       };

//       const mockMutateResponse = createSearchResponseMock();
//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockMutateResponse,
//       });

//       const result = await mutationService.mutate(mutateRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/mutate",
//           data: mutateRequest,
//         }),
//       );
//       expect(result).toEqual(mockMutateResponse);
//     });

//     it("devrait effectuer une mutation avec création de relation", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "create",
//             attributes: {
//               firstname: "John",
//               lastname: "Doe",
//               email: "john@example.com",
//             },
//             relations: {
//               applications: {
//                 operation: "create",
//                 attributes: {
//                   name: "New App",
//                   domain: "app.example.com",
//                 },
//               },
//             },
//           },
//         ],
//       };

//       const mockMutateResponse = createSearchResponseMock();
//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockMutateResponse,
//       });

//       const result = await mutationService.mutate(mutateRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/mutate",
//           data: mutateRequest,
//         }),
//       );
//       expect(result).toEqual(mockMutateResponse);
//     });

//     it("devrait effectuer une mutation avec attachement de relation", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "create",
//             attributes: {
//               firstname: "John",
//               lastname: "Doe",
//               email: "john@example.com",
//             },
//             relations: {
//               applications: {
//                 operation: "attach",
//                 key: 1,
//               },
//             },
//           },
//         ],
//       };

//       const mockMutateResponse = createSearchResponseMock();
//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockMutateResponse,
//       });

//       const result = await mutationService.mutate(mutateRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/mutate",
//           data: mutateRequest,
//         }),
//       );
//       expect(result).toEqual(mockMutateResponse);
//     });
//   });

//   describe("Execute Action Method", () => {
//     it("devrait exécuter une action simple", async () => {
//       const actionRequest: ActionRequest = {
//         action: "activate",
//         params: {
//           fields: [{ name: "status", value: "active" }],
//         },
//       };

//       const mockActionResponse = {
//         success: true,
//         data: { activated: 1 },
//       };

//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockActionResponse,
//       });

//       const result = await mutationService.executeAction(actionRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/actions/activate",
//           data: actionRequest.params,
//         }),
//       );
//       expect(result).toEqual(mockActionResponse);
//     });

//     it("devrait exécuter une action avec des filtres de recherche", async () => {
//       const actionRequest: ActionRequest = {
//         action: "deactivate",
//         params: {
//           fields: [{ name: "status", value: "inactive" }],
//           search: {
//             filters: [{ field: "last_login", value: "2024-01-01" }],
//           },
//         },
//       };

//       const mockActionResponse = {
//         success: true,
//         data: { deactivated: 5 },
//       };

//       (mockAxiosInstance.request as Mock).mockResolvedValue({
//         data: mockActionResponse,
//       });

//       const result = await mutationService.executeAction(actionRequest);

//       expect(mockAxiosInstance.request).toHaveBeenCalledWith(
//         expect.objectContaining({
//           method: "POST",
//           url: "/actions/deactivate",
//           data: actionRequest.params,
//         }),
//       );
//       expect(result).toEqual(mockActionResponse);
//     });
//   });

//   describe("Error Handling", () => {
//     it("devrait gérer les erreurs de mutation", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "create",
//             attributes: {
//               firstname: "John",
//               lastname: "Doe",
//               email: "john@example.com",
//             },
//           },
//         ],
//       };

//       const mockError = new Error("Network error");
//       (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

//       await expect(mutationService.mutate(mutateRequest)).rejects.toThrow();
//     });

//     it("devrait gérer les erreurs d'action", async () => {
//       const actionRequest: ActionRequest = {
//         action: "activate",
//         params: {
//           fields: [{ name: "status", value: "active" }],
//         },
//       };

//       const mockError = new Error("Network error");
//       (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

//       await expect(
//         mutationService.executeAction(actionRequest),
//       ).rejects.toThrow();
//     });

//     it("devrait contenir l'erreur originale dans ApiServiceError", async () => {
//       const mutateRequest: MutateRequest<
//         UserAttributes,
//         UserRelations,
//         UserRelationAttributesMap
//       > = {
//         mutate: [
//           {
//             operation: "create",
//             attributes: {
//               firstname: "John",
//               lastname: "Doe",
//               email: "john@example.com",
//             },
//           },
//         ],
//       };

//       const mockError = new Error("Network error");
//       (mockAxiosInstance.request as Mock).mockRejectedValue(mockError);

//       try {
//         await mutationService.mutate(mutateRequest);
//       } catch (error: unknown) {
//         expect((error as { name: string }).name).toBe("ApiRequestError");
//         expect((error as { originalError: Error }).originalError).toBe(
//           mockError,
//         );
//       }
//     });
//   });
// });
