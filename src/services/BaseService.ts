import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import axiosRetry from "axios-retry";
import { SearchRequest } from "@/interfaces/SearchRequest";
import { ActionRequest } from "@/interfaces/ActionRequest";
import { MutateRequest } from "@/interfaces";

interface SearchResponse<T> {
  data: T[];
  meta?: {
    page: number;
    perPage: number;
    total: number;
  };
}

interface MutateResponse<T> {
  data: T[];
}

interface ActionResponse {
  success: boolean;
  data?: any;
}

// Service configuration
interface ServiceConfiguration {
  pathname: string;
  baseDevUrl?: string;
  baseProdUrl?: string;
}

export abstract class BaseService<R, T> {
  protected axiosInstance: AxiosInstance;
  protected baseDevUrl: string;
  protected baseProdUrl: string;
  protected pathname: string;

  private isRefreshing = false;
  private refreshTokenPromise: Promise<void> | null = null;
  private readonly MAX_RETRIES = 3;

  constructor({
    pathname,
    baseDevUrl = "http://localhost:8000",
    baseProdUrl = "https://api.example.com",
  }: ServiceConfiguration) {
    this.pathname = pathname;
    this.baseDevUrl = baseDevUrl;
    this.baseProdUrl = baseProdUrl;

    this.axiosInstance = this.createAxiosInstance();
    this.initializeRetry();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.getBaseApiUrl(),
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
  }

  private getBaseApiUrl(): string {
    return process.env.NODE_ENV === "production"
      ? `${this.baseProdUrl}/${this.pathname}`
      : `${this.baseDevUrl}/api/${this.pathname}`;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) =>
        this.addAuthorizationHeader(config) as InternalAxiosRequestConfig,
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => this.handleResponseError(error),
    );
  }

  private addAuthorizationHeader(
    config: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const token = getCookie("jwt");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }

  private async handleResponseError(error: any): Promise<any> {
    const originalRequest = error.config;
    if (originalRequest._retry || !error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !this.isRefreshing) {
      originalRequest._retry = true;
      try {
        await this.handleTokenRefresh();
        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        this.handleAuthenticationFailure();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }

  private async handleTokenRefresh(): Promise<void> {
    if (!this.refreshTokenPromise) {
      this.isRefreshing = true;
      this.refreshTokenPromise = this.refreshToken().finally(() => {
        this.isRefreshing = false;
        this.refreshTokenPromise = null;
      });
    }
    return this.refreshTokenPromise;
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.getBaseApiUrl()}/refresh-token`,
        {},
        { withCredentials: true },
      );

      if (!response.data?.token?.access_token) {
        throw new Error("Invalid token refresh response");
      }

      this.updateTokens(response.data.token);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private updateTokens(tokens: {
    access_token: string;
    refresh_token?: string;
  }): void {
    setCookie("jwt", tokens.access_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    if (tokens.refresh_token) {
      setCookie("refresh_token", tokens.refresh_token, {
        maxAge: 60 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
      });
    }
  }

  public clearTokens(): void {
    deleteCookie("jwt");
    deleteCookie("refresh_token");
  }

  private handleAuthenticationFailure(): void {
    this.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  private initializeRetry(): void {
    axiosRetry(this.axiosInstance, {
      retries: this.MAX_RETRIES,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error: any) =>
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.response?.status === 429,
    });
  }

  protected async request<ResponseType>(
    config: AxiosRequestConfig,
  ): Promise<ResponseType> {
    try {
      const response: AxiosResponse<ResponseType> = await this.axiosInstance(
        config,
      );
      return response.data;
    } catch (error) {
      console.error(
        `API Request failed: ${config.method} ${config.url}`,
        error,
      );
      throw error;
    }
  }

  // rest-api Methods
  public async search(params: SearchRequest): Promise<SearchResponse<T>> {
    return this.request<SearchResponse<T>>({
      method: "POST",
      url: "/search",
      data: { search: params },
    });
  }

  public async mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>> {
    return this.request<MutateResponse<T>>({
      method: "POST",
      url: "/mutate",
      data: { mutate: mutations },
    });
  }

  public async executeAction(
    action: string,
    params: ActionRequest,
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>({
      method: "POST",
      url: `/actions/${action}`,
      data: params,
    });
  }

  // Basic CRUD
  public async fetchAll(params?: Record<string, any>): Promise<T[]> {
    return this.request<T[]>({
      method: "GET",
      params,
    });
  }

  public async fetchById(id: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: "GET",
      url: `/${id}`,
      params,
    });
  }

  public async create(data: Partial<R>): Promise<T> {
    return this.request<T>({
      method: "POST",
      data,
    });
  }

  public async update(id: string, data: Partial<R>): Promise<T> {
    return this.request<T>({
      method: "PUT",
      url: `/${id}`,
      data,
    });
  }

  public async delete(id: string): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      url: `/${id}`,
    });
  }
}
