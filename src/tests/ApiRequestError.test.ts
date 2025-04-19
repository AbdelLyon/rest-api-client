import { describe, expect, it, test } from "vitest";
import type { RequestConfig } from "@/http/types/http";
import { ApiRequestError } from "@/error/ApiRequestError";

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

  it("devrait extraire les informations de statut et données", () => {
    const originalError = {
      status: 500,
      statusText: "Internal Server Error",
      data: { message: "Something went wrong" }
    };

    const requestConfig: RequestConfig = { url: "/api/data", method: "POST" };
    const error = new ApiRequestError(originalError, requestConfig);

    expect(error.status).toBe(500);
    expect(error.statusText).toBe("Internal Server Error");
    expect(error.data).toEqual({ message: "Something went wrong" });
  });

  it("devrait gérer les erreurs de fetch Response", () => {
    const response = new Response(null, {
      status: 403,
      statusText: "Forbidden"
    });

    const originalError = {
      message: "Forbidden request",
      response
    };

    const requestConfig: RequestConfig = { url: "/api/protected" };
    const error = new ApiRequestError(originalError, requestConfig);

    expect(error.status).toBe(403);
    expect(error.statusText).toBe("Forbidden");
    expect(error.isForbidden()).toBe(true);
  });

  // Utiliser test.each pour des tests paramétrés plus clairs
  const errorMethods = [
    { status: 404, method: "isNotFound" },
    { status: 401, method: "isUnauthorized" },
    { status: 403, method: "isForbidden" },
    { status: 500, method: "isServerError" },
    { status: undefined, method: "isNetworkError" },
  ] as const;

  test.each(errorMethods)(
    "$method() devrait retourner true pour status $status",
    ({ status, method }) => {
      const originalError = { status };
      const requestConfig: RequestConfig = { url: "/test" };
      const error = new ApiRequestError(originalError, requestConfig);

      // Vérifier si la méthode existe et est une fonction
      if (typeof error[method] === 'function') {
        // Appeler la méthode avec un type casting sécurisé
        const result = (error[method])();
        expect(result).toBe(true);
      } else {
        // Si la méthode n'existe pas, faire échouer le test
        expect(`La méthode ${method} n'existe pas`).toBe(false);
      }
    }
  );

  // Tester également les cas négatifs
  const negativeTests = [
    { status: 200, method: "isNotFound" },
    { status: 200, method: "isUnauthorized" },
    { status: 200, method: "isForbidden" },
    { status: 200, method: "isServerError" },
    { status: 404, method: "isNetworkError" },
  ] as const;

  test.each(negativeTests)(
    "$method() devrait retourner false pour status $status",
    ({ status, method }) => {
      const originalError = { status };
      const requestConfig: RequestConfig = { url: "/test" };
      const error = new ApiRequestError(originalError, requestConfig);

      if (typeof error[method] === 'function') {
        const result = (error[method])();
        expect(result).toBe(false);
      } else {
        expect(`La méthode ${method} n'existe pas`).toBe(false);
      }
    }
  );
});