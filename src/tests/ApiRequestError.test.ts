import { describe, it, expect } from "vitest";
import { ApiRequestError } from "@/services/ApiRequestError";
import type { RequestConfig } from "@/types/common"; // Assurez-vous d'importer le type

describe("ApiRequestError", () => {
  it("devrait créer une instance avec les propriétés attendues", () => {
    const originalError = new Error("Network Error");
    const requestConfig: RequestConfig = { url: "/test", method: "GET" };

    const error = new ApiRequestError(originalError, requestConfig);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiRequestError");
    expect(error.message).toBe("Network Error");
    expect(error.originalError).toBe(originalError);
    expect(error.requestConfig).toBe(requestConfig);
  });

  // Adapter les autres tests de la même manière...

  it("devrait fournir des méthodes utilitaires pour vérifier le type d'erreur", () => {
    const errorCases = [
      { status: 404, method: "isNotFound", expected: true },
      { status: 401, method: "isUnauthorized", expected: true },
      { status: 403, method: "isForbidden", expected: true },
      { status: 500, method: "isServerError", expected: true },
      { status: undefined, method: "isNetworkError", expected: true },
    ];

    for (const testCase of errorCases) {
      const originalError = { status: testCase.status };
      // Assurez-vous que cet objet est conforme à RequestConfig
      const requestConfig: RequestConfig = { url: "/test" };

      const error = new ApiRequestError(originalError, requestConfig);

      expect(error[testCase.method as keyof ApiRequestError]()).toBe(
        testCase.expected,
      );
    }
  });
});