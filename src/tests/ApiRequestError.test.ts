import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import { ApiRequestError } from "@/services/ApiRequestError";

describe("ApiRequestError", () => {
  it("devrait créer une instance avec les propriétés attendues", () => {
    const axiosErrorMock = new Error("Network Error") as AxiosError;
    Object.assign(axiosErrorMock, {
      isAxiosError: true,
      config: { url: "/test" },
      toJSON: () => ({}),
      name: "AxiosError",
      code: "ERR_NETWORK",
    });

    const requestConfig = { url: "/test", method: "GET" };

    const error = new ApiRequestError(axiosErrorMock, requestConfig);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiRequestError");
    expect(error.message).toBe("API Service Request Failed");
    expect(error.originalError).toBe(axiosErrorMock);
    expect(error.requestConfig).toBe(requestConfig);
  });

  it("devrait préserver les détails de l'erreur originale", () => {
    // Simuler une erreur avec réponse
    const axiosErrorWithResponse = new Error("Server Error") as AxiosError;
    Object.assign(axiosErrorWithResponse, {
      isAxiosError: true,
      config: { url: "/api/data", method: "POST" },
      response: {
        status: 500,
        data: { message: "Internal Server Error" },
      },
      name: "AxiosError",
      code: "ERR_BAD_RESPONSE",
      toJSON: () => ({}),
    });

    const requestConfig = {
      url: "/api/data",
      method: "POST",
      data: { id: 123 },
    };

    const error = new ApiRequestError(axiosErrorWithResponse, requestConfig);

    expect(error.originalError.response?.status).toBe(500);
    expect(error.originalError.response?.data).toEqual({
      message: "Internal Server Error",
    });
    expect(error.requestConfig).toEqual(requestConfig);
  });
});
