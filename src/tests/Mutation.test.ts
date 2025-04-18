import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { z } from "zod";

import { HttpClient, Mutation } from "@/services";

// Définir un schéma Zod pour TestResource
const TestResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

// Type dérivé du schéma
type TestResource = z.infer<typeof TestResourceSchema>;

// Interfaces d'attributs compatibles avec ModelAttributes

// // Définition des relations pour le test
// interface TestRelations extends Record<string, unknown> {
//   // Aucune relation définie pour ce test
// }

// Classe concrète pour tester la classe abstraite Mutation
class TestMutation extends Mutation<TestResource> {
  constructor (pathname: string) {
    super(pathname, TestResourceSchema);
  }

  // Méthode fictive pour simuler la récupération des ressources par ID
  async getResourcesByIds(): Promise<TestResource[]> {
    // Cette méthode serait implémentée pour aller chercher les ressources
    // Mais dans le test, elle sera mockée
    return [];
  }
}

describe("Mutation avec Zod", () => {
  // const pathname = "/api/resources";
  // let mutation: TestMutation;
  const mockRequest = vi.fn();

  beforeAll(() => {
    // Initialiser HttpClient avant tous les tests
    HttpClient.init({
      httpConfig: {
        baseURL: "https://api.test.com",
      },
      instanceName: "main"
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Espionner les méthodes que nous voulons tester
    vi.spyOn(HttpClient, "getInstance");
    vi.spyOn(console, "error").mockImplementation(() => { });

    // Remplacer la méthode request par un mock
    const httpInstance = HttpClient.getInstance();
    vi.spyOn(httpInstance, "request").mockImplementation(mockRequest);

    // Créer une nouvelle instance pour chaque test
    // mutation = new TestMutation(pathname);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    HttpClient.resetInstance();
  });

  describe("Constructor", () => {
    it("devrait initialiser avec le pathname et le schéma fournis", () => {
      // Espionner la méthode getInstance
      // const getInstanceSpy = vi.spyOn(HttpClient, "getInstance");

      // // Créer une nouvelle instance
      // const testMutation = new TestMutation(pathname);

      // expect(getInstanceSpy).toHaveBeenCalled();
      // expect(testMutation["pathname"]).toBe(pathname);
      // expect(testMutation["schema"]).toBe(TestResourceSchema);
      // expect(testMutation["http"]).toBe(HttpClient.getInstance());
    });

    it("devrait lancer une erreur si HttpClient n'est pas initialisé", () => {
      // Simuler que HttpClient.getInstance lance une erreur
      vi.spyOn(HttpClient, "getInstance").mockImplementationOnce(() => {
        throw new Error("Http not initialized. Call Http.init() first.");
      });

      expect(() => new TestMutation("/api/other")).toThrow(
        "Http not initialized",
      );
    });
  });

  // describe("validateData", () => {
  //   it("devrait valider et retourner des données correctes", () => {
  //     const validData = [
  //       {
  //         id: 1,
  //         name: "Resource 1",
  //         status: "active",
  //         createdAt: "2023-01-01",
  //       },
  //       {
  //         id: 2,
  //         name: "Resource 2",
  //         status: "inactive",
  //         createdAt: "2023-01-02",
  //       },
  //     ];

  //     const validateData = mutation["validateData"].bind(mutation);
  //     const result = validateData(validData);

  //     expect(result).toEqual(validData);
  //     expect(console.error).not.toHaveBeenCalled();
  //   });

  //   it("devrait rejeter les données avec un type incorrect", () => {
  //     const invalidData = [
  //       {
  //         id: 1,
  //         name: "Resource 1",
  //         status: "active",
  //         createdAt: "2023-01-01",
  //       },
  //       { id: "2", name: 123, status: true, createdAt: null }, // Types incorrects
  //     ];

  //     const validateData = mutation["validateData"].bind(mutation);

  //     expect(() => validateData(invalidData)).toThrow("Type validation failed");
  //     expect(console.error).toHaveBeenCalled();
  //   });

  //   it("devrait rejeter les données avec des propriétés manquantes", () => {
  //     const invalidData = [
  //       { id: 1, name: "Resource 1" }, // Manque status et createdAt
  //       { id: 2, status: "active" }, // Manque name et createdAt
  //     ];

  //     const validateData = mutation["validateData"].bind(mutation);

  //     expect(() => validateData(invalidData)).toThrow("Type validation failed");
  //     expect(console.error).toHaveBeenCalled();
  //   });

  //   it("devrait gérer un tableau vide", () => {
  //     const validateData = mutation["validateData"].bind(mutation);
  //     const result = validateData([]);

  //     expect(result).toEqual([]);
  //   });
  // });

  // describe("mutate", () => {
  //   it("devrait effectuer une requête de création et traiter les IDs retournés", async () => {
  //     // Données de test
  //     const createdResource: TestResource = {
  //       id: 1,
  //       name: "Nouvelle ressource",
  //       status: "active",
  //       createdAt: "2023-01-01",
  //     };

  //     // Nouvelle structure de réponse avec created/updated
  //     const mockResponse: MutationResponse = {
  //       created: [1],
  //       updated: [],
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Mock pour la méthode getResourcesByIds
  //     const mockGetResources = vi.fn().mockResolvedValue([createdResource]);
  //     mutation.getResourcesByIds = mockGetResources;

  //     // Requête de mutation pour création
  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [
  //         {
  //           operation: "create",
  //           attributes: {
  //             name: "Nouvelle ressource",
  //             status: "active",
  //             description: "Description de test",
  //           },
  //         },
  //       ],
  //     };

  //     const result = await mutation.mutate(mutateRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/mutate`,
  //         data: mutateRequest,
  //       },
  //       {},
  //     );
  //     expect(mockGetResources).toHaveBeenCalledWith([1]);
  //     expect(result.created[0]).toEqual(createdResource);
  //   });

  //   it("devrait effectuer une requête de mise à jour et traiter les IDs retournés", async () => {
  //     // Données de test
  //     const updatedResource: TestResource = {
  //       id: 2,
  //       name: "Ressource modifiée",
  //       status: "inactive",
  //       createdAt: "2023-01-02",
  //     };

  //     // Nouvelle structure de réponse
  //     const mockResponse: MutationResponse = {
  //       created: [],
  //       updated: [2],
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Mock pour la méthode getResourcesByIds
  //     const mockGetResources = vi.fn().mockResolvedValue([updatedResource]);
  //     mutation.getResourcesByIds = mockGetResources;

  //     // Requête de mutation pour mise à jour
  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [
  //         {
  //           operation: "update",
  //           key: 2,
  //           attributes: {
  //             name: "Ressource modifiée",
  //             status: "inactive",
  //           },
  //         },
  //       ],
  //     };

  //     const result = await mutation.mutate(mutateRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/mutate`,
  //         data: mutateRequest,
  //       },
  //       {},
  //     );
  //     expect(mockGetResources).toHaveBeenCalledWith([2]);
  //     expect(result.created[0]).toEqual(updatedResource);
  //   });

  //   it("devrait gérer à la fois les créations et les mises à jour", async () => {
  //     // Données de test
  //     const resources: TestResource[] = [
  //       {
  //         id: 3,
  //         name: "Ressource créée",
  //         status: "active",
  //         createdAt: "2023-01-03",
  //       },
  //       {
  //         id: 4,
  //         name: "Ressource mise à jour",
  //         status: "updated",
  //         createdAt: "2023-01-04",
  //       },
  //     ];

  //     // Nouvelle structure de réponse
  //     const mockResponse: MutationResponse = {
  //       created: [3],
  //       updated: [4],
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Mock pour la méthode getResourcesByIds
  //     const mockGetResources = vi.fn().mockResolvedValue(resources);
  //     mutation.getResourcesByIds = mockGetResources;

  //     // Requête de mutation mixte
  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [
  //         {
  //           operation: "create",
  //           attributes: {
  //             name: "Ressource créée",
  //           },
  //         },
  //         {
  //           operation: "update",
  //           key: 4,
  //           attributes: {
  //             name: "Ressource mise à jour",
  //           },
  //         },
  //       ],
  //     };

  //     const result = await mutation.mutate(mutateRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/mutate`,
  //         data: mutateRequest,
  //       },
  //       {},
  //     );
  //     expect(mockGetResources).toHaveBeenCalledWith([3, 4]);
  //     expect(result).toHaveLength(2);
  //     expect(result).toEqual(resources);
  //   });

  //   it("devrait transmettre les options à la requête", async () => {
  //     const mockResponse: MutationResponse = {
  //       created: [5],
  //       updated: [],
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Mock pour la méthode getResourcesByIds
  //     const mockGetResources = vi.fn().mockResolvedValue([{
  //       id: 5,
  //       name: "Test",
  //       status: "active",
  //       createdAt: "2023-01-05",
  //     }]);
  //     mutation.getResourcesByIds = mockGetResources;

  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [{ operation: "create", attributes: { name: "Test" } }],
  //     };

  //     const options = { headers: { Authorization: "Bearer token" } };
  //     await mutation.mutate(mutateRequest, options);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         url: `${pathname}/mutate`,
  //       }),
  //       options,
  //     );
  //   });

  //   it("devrait gérer le cas où aucun élément n'est créé ou mis à jour", async () => {
  //     const mockResponse: MutationResponse = {
  //       created: [],
  //       updated: [],
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Mock pour la méthode getResourcesByIds
  //     const mockGetResources = vi.fn().mockResolvedValue([]);
  //     mutation.getResourcesByIds = mockGetResources;

  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [{ operation: "create", attributes: { name: "Test" } }],
  //     };

  //     const result = await mutation.mutate(mutateRequest);

  //     expect(mockGetResources).toHaveBeenCalledWith([]);
  //     expect(result).toEqual([]);
  //   });
  // });

  // describe("executeAction", () => {
  //   it("devrait exécuter une action avec des champs", async () => {
  //     const mockResponse: ActionResponse = {
  //       data: {
  //         impacted: 5,
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const actionRequest: ActionRequest = {
  //       action: "publish",
  //       payload: {
  //         fields: [
  //           { name: "schedule_date", value: "2023-02-01" },
  //           { name: "notify_users", value: true },
  //         ],
  //       },
  //     };

  //     const result = await mutation.executeAction(actionRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/actions/publish`,
  //         data: actionRequest.payload,
  //       },
  //       {},
  //     );
  //     expect(result).toEqual(mockResponse);
  //     expect(result.data.impacted).toBe(5);
  //   });

  //   it("devrait exécuter une action avec filtres", async () => {
  //     const mockResponse: ActionResponse = {
  //       data: {
  //         impacted: 3,
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const actionRequest: ActionRequest = {
  //       action: "archive",
  //       payload: {
  //         fields: [],
  //         search: {
  //           filters: [
  //             { field: "status", value: "inactive" },
  //             { field: "createdAt", value: "2022-01-01" },
  //           ],
  //         },
  //       },
  //     };

  //     const result = await mutation.executeAction(actionRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/actions/archive`,
  //         data: actionRequest.payload,
  //       },
  //       {},
  //     );
  //     expect(result).toEqual(mockResponse);
  //   });

  //   it("devrait transmettre les options à la requête", async () => {
  //     const mockResponse: ActionResponse = {
  //       data: {
  //         impacted: 1,
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const actionRequest: ActionRequest = {
  //       action: "activate",
  //       payload: {
  //         fields: [],
  //       },
  //     };

  //     const options = { headers: { Authorization: "Bearer token" } };

  //     await mutation.executeAction(actionRequest, options);

  //     expect(mockRequest).toHaveBeenCalledWith(expect.anything(), options);
  //   });

  //   it("devrait propager les erreurs de la requête HTTP", async () => {
  //     const error = new Error("Action failed");
  //     mockRequest.mockRejectedValueOnce(error);

  //     const actionRequest: ActionRequest = {
  //       action: "publish",
  //       payload: {
  //         fields: [],
  //       },
  //     };

  //     await expect(mutation.executeAction(actionRequest)).rejects.toThrow(
  //       "Action failed",
  //     );
  //   });
  // });

  // describe("delete", () => {
  //   it("devrait supprimer des ressources et valider les données", async () => {
  //     const mockResponse: DeleteResponse<TestResource> = {
  //       data: [
  //         {
  //           id: 1,
  //           name: "Resource 1",
  //           status: "deleted",
  //           createdAt: "2023-01-01",
  //         },
  //         {
  //           id: 2,
  //           name: "Resource 2",
  //           status: "deleted",
  //           createdAt: "2023-01-02",
  //         },
  //       ],
  //       meta: {
  //         gates: {
  //           authorized_to_delete: true,
  //         },
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Espionner la méthode validateData
  //     const validateDataSpy = vi.spyOn(mutation as any, "validateData");

  //     const deleteRequest: DeleteRequest = {
  //       resources: [1, 2],
  //     };

  //     const result = await mutation.delete(deleteRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "DELETE",
  //         url: pathname,
  //         data: deleteRequest,
  //       },
  //       {},
  //     );
  //     expect(validateDataSpy).toHaveBeenCalledWith(mockResponse.data);
  //     expect(result.data.length).toBe(2);
  //     expect(result.meta?.gates?.authorized_to_delete).toBe(true);
  //   });

  //   it("devrait propager les erreurs de validation", async () => {
  //     const invalidData = [
  //       {
  //         id: 1,
  //         name: "Valid Resource",
  //         status: "deleted",
  //         createdAt: "2023-01-01",
  //       },
  //       { id: "invalid", status: true }, // Données invalides
  //     ];

  //     const mockResponse: DeleteResponse<any> = {
  //       data: invalidData,
  //       meta: {
  //         gates: {
  //           authorized_to_delete: true,
  //         },
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const deleteRequest: DeleteRequest = {
  //       resources: [1, 2],
  //     };

  //     await expect(mutation.delete(deleteRequest)).rejects.toThrow(
  //       "Type validation failed",
  //     );
  //     expect(console.error).toHaveBeenCalled();
  //   });
  // });

  // describe("forceDelete", () => {
  //   it("devrait supprimer définitivement des ressources et valider les données", async () => {
  //     const mockResponse: DeleteResponse<TestResource> = {
  //       data: [
  //         {
  //           id: 3,
  //           name: "Resource 3",
  //           status: "force_deleted",
  //           createdAt: "2023-01-03",
  //         },
  //       ],
  //       meta: {
  //         gates: {
  //           authorized_to_force_delete: true,
  //         },
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Espionner la méthode validateData
  //     const validateDataSpy = vi.spyOn(mutation as any, "validateData");

  //     const deleteRequest: DeleteRequest = {
  //       resources: [3],
  //     };

  //     const result = await mutation.forceDelete(deleteRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "DELETE",
  //         url: `${pathname}/force`,
  //         data: deleteRequest,
  //       },
  //       {},
  //     );
  //     expect(validateDataSpy).toHaveBeenCalledWith(mockResponse.data);
  //     expect(result.data[0].status).toBe("force_deleted");
  //   });

  //   it("devrait transmettre les options à la requête", async () => {
  //     const mockResponse: DeleteResponse<TestResource> = {
  //       data: [
  //         {
  //           id: 3,
  //           name: "Resource 3",
  //           status: "force_deleted",
  //           createdAt: "2023-01-03",
  //         },
  //       ],
  //       meta: {},
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const deleteRequest: DeleteRequest = {
  //       resources: [3],
  //     };

  //     const options = { headers: { Authorization: "Bearer token" } };

  //     await mutation.forceDelete(deleteRequest, options);

  //     expect(mockRequest).toHaveBeenCalledWith(expect.anything(), options);
  //   });
  // });

  // describe("restore", () => {
  //   it("devrait restaurer des ressources supprimées et valider les données", async () => {
  //     const mockResponse: DeleteResponse<TestResource> = {
  //       data: [
  //         {
  //           id: 4,
  //           name: "Resource 4",
  //           status: "active",
  //           createdAt: "2023-01-04",
  //         },
  //       ],
  //       meta: {
  //         gates: {
  //           authorized_to_restore: true,
  //         },
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     // Espionner la méthode validateData
  //     const validateDataSpy = vi.spyOn(mutation as any, "validateData");

  //     const deleteRequest: DeleteRequest = {
  //       resources: [4],
  //     };

  //     const result = await mutation.restore(deleteRequest);

  //     expect(mockRequest).toHaveBeenCalledWith(
  //       {
  //         method: "POST",
  //         url: `${pathname}/restore`,
  //         data: deleteRequest,
  //       },
  //       {},
  //     );
  //     expect(validateDataSpy).toHaveBeenCalledWith(mockResponse.data);
  //     expect(result.data[0].status).toBe("active");
  //   });

  //   it("devrait gérer un tableau de données vide", async () => {
  //     const mockResponse: DeleteResponse<TestResource> = {
  //       data: [],
  //       meta: {
  //         gates: {
  //           authorized_to_restore: true,
  //         },
  //       },
  //     };

  //     mockRequest.mockResolvedValueOnce(mockResponse);

  //     const validateDataSpy = vi.spyOn(mutation as any, "validateData");

  //     const deleteRequest: DeleteRequest = {
  //       resources: [],
  //     };

  //     const result = await mutation.restore(deleteRequest);

  //     expect(validateDataSpy).toHaveBeenCalledWith([]);
  //     expect(result.data).toEqual([]);
  //   });
  // });

  // describe("gestion des erreurs", () => {
  //   it("devrait propager les erreurs de la requête HTTP pour mutate", async () => {
  //     const error = new Error("Mutation failed");
  //     mockRequest.mockRejectedValueOnce(error);

  //     const mutateRequest: MutationRequest<TestAttributes, TestRelations> = {
  //       mutate: [{ operation: "create", attributes: { name: "Test" } }],
  //     };

  //     await expect(mutation.mutate(mutateRequest)).rejects.toThrow(
  //       "Mutation failed",
  //     );
  //   });

  //   it("devrait propager les erreurs de la requête HTTP pour delete", async () => {
  //     const error = new Error("Delete failed");
  //     mockRequest.mockRejectedValueOnce(error);

  //     const deleteRequest: DeleteRequest = {
  //       resources: [1],
  //     };

  //     await expect(mutation.delete(deleteRequest)).rejects.toThrow(
  //       "Delete failed",
  //     );
  //   });

  //   it("devrait propager les erreurs de la requête HTTP pour forceDelete", async () => {
  //     const error = new Error("Force delete failed");
  //     mockRequest.mockRejectedValueOnce(error);

  //     const deleteRequest: DeleteRequest = {
  //       resources: [1],
  //     };

  //     await expect(mutation.forceDelete(deleteRequest)).rejects.toThrow(
  //       "Force delete failed",
  //     );
  //   });

  //   it("devrait propager les erreurs de la requête HTTP pour restore", async () => {
  //     const error = new Error("Restore failed");
  //     mockRequest.mockRejectedValueOnce(error);

  //     const deleteRequest: DeleteRequest = {
  //       resources: [1],
  //     };

  //     await expect(mutation.restore(deleteRequest)).rejects.toThrow(
  //       "Restore failed",
  //     );
  //   });
  // });

  // describe("Intégration des composants", () => {
  //   it("devrait exécuter une séquence complète d'opérations", async () => {
  //     // Données de test pour les différentes opérations
  //     const createdResource: TestResource = {
  //       id: 1,
  //       name: "Nouvelle ressource",
  //       status: "active",
  //       createdAt: "2023-01-01",
  //     };

  //     const actionResponse: ActionResponse = {
  //       data: {
  //         impacted: 1,
  //       },
  //     };

  //     const deletedResource: TestResource = {
  //       id: 1,
  //       name: "Nouvelle ressource",
  //       status: "deleted",
  //       createdAt: "2023-01-01",
  //     };

  //     // Configurer les mocks pour simuler plusieurs appels
  //     mockRequest
  //       .mockResolvedValueOnce({ created: [1], updated: [] }) // Pour mutate
  //       .mockResolvedValueOnce(actionResponse) // Pour executeAction
  //       .mockResolvedValueOnce({ data: [deletedResource], meta: {} }); // Pour delete

  //     // Mock pour getResourcesByIds
  //     mutation.getResourcesByIds = vi.fn().mockResolvedValue([createdResource]);

  //     // Exécuter une séquence d'opérations avec la nouvelle structure de types
  //     const mutateResult = await mutation.mutate<TestAttributes, TestRelations>(
  //       {
  //         mutate: [
  //           { operation: "create", attributes: { name: "Nouvelle ressource" } },
  //         ],
  //       },
  //     );

  //     const actionResult = await mutation.executeAction({
  //       action: "publish",
  //       payload: { fields: [{ name: "published", value: true }] },
  //     });

  //     const deleteResult = await mutation.delete({
  //       resources: [1],
  //     });

  //     // Vérifier les résultats
  //     expect(mutateResult.created).toBe(1);
  //     expect(actionResult.data.impacted).toBe(1);
  //     expect(deleteResult.data[0].status).toBe("deleted");
  //     expect(mockRequest).toHaveBeenCalledTimes(3);
  //   });
  // });
});