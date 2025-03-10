import { AxiosError, AxiosRequestConfig } from "axios";

export class ApiRequestError extends Error {
  constructor(
    public originalError: AxiosError,
    public requestConfig: AxiosRequestConfig,
  ) {
    super("API Service Request Failed");
    this.name = "ApiRequestError";
  }
}
