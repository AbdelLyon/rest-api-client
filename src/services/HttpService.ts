import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export abstract class HttpService {
  protected axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshTokenPromise: Promise<void> | null = null;
  private readonly MAX_RETRIES = 3;

  constructor(baseUrl: string) {
    this.axiosInstance = this.createInstance(baseUrl);
    this.initializeRetry();
    this.setupInterceptors();
  }

  private createInstance(baseUrl: string): AxiosInstance {
    return axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      this.addAuthorizationHeader,
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this),
    );
  }

  private addAuthorizationHeader(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
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
        `${this.axiosInstance.defaults.baseURL}/refresh-token`,
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

  protected updateTokens(tokens: {
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

  protected clearTokens(): void {
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
      retryCondition: (error) =>
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.response?.status === 429,
    });
  }
}
