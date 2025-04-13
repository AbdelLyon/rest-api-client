import type { IHttpClient } from "@/interfaces";
import type { HttpConfig, HttpConfigOptions, RequestConfig, RequestInterceptor, ResponseErrorInterceptor, ResponseSuccessInterceptor } from "@/types/common";
import { ApiRequestError } from "./ApiRequestError";

export class HttpClient implements IHttpClient {
  private static instances: Map<string, HttpClient> = new Map();
  private static defaultInstanceName: string = "default";

  // Intercepteurs statiques
  private static requestInterceptors: RequestInterceptor[] = [];
  private static responseSuccessInterceptors: ResponseSuccessInterceptor[] = [];
  private static responseErrorInterceptors: ResponseErrorInterceptor[] = [];

  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private withCredentials: boolean;
  private maxRetries: number;

  private constructor () {
    this.baseURL = "";
    this.defaultTimeout = 10000;
    this.defaultHeaders = {};
    this.withCredentials = true;
    this.maxRetries = 3;
  }

  /**
   * Initialise une nouvelle instance HTTP avec intercepteurs
   */
  static init(
    options: HttpConfig,
    instanceName: string = "default",
  ): HttpClient {
    // Ajouter les intercepteurs spécifiés dans les options
    if (options.interceptors) {
      // Intercepteurs de requête
      if (options.interceptors.request && options.interceptors.request.length > 0) {
        HttpClient.requestInterceptors = [
          ...HttpClient.requestInterceptors,
          ...options.interceptors.request
        ];
      }

      // Intercepteurs de réponse
      if (options.interceptors.response) {
        // Intercepteurs de succès
        if (options.interceptors.response.success && options.interceptors.response.success.length > 0) {
          HttpClient.responseSuccessInterceptors = [
            ...HttpClient.responseSuccessInterceptors,
            ...options.interceptors.response.success
          ];
        }

        // Intercepteurs d'erreur
        if (options.interceptors.response.error && options.interceptors.response.error.length > 0) {
          HttpClient.responseErrorInterceptors = [
            ...HttpClient.responseErrorInterceptors,
            ...options.interceptors.response.error
          ];
        }
      }
    }

    // Créer ou récupérer l'instance
    if (!this.instances.has(instanceName)) {
      const instance = new HttpClient();
      instance.configure(options);
      this.instances.set(instanceName, instance);

      // Si c'est la première instance, la définir comme instance par défaut
      if (this.instances.size === 1) {
        this.defaultInstanceName = instanceName;
      }
    }
    return this.instances.get(instanceName)!;
  }

  /**
   * Récupère une instance existante
   */
  static getInstance(instanceName?: string): HttpClient {
    const name = instanceName || this.defaultInstanceName;

    if (!this.instances.has(name)) {
      throw new Error(
        `Http instance '${name}' not initialized. Call Http.init() first.`,
      );
    }
    return this.instances.get(name)!;
  }

  /**
   * Définit l'instance par défaut
   */
  static setDefaultInstance(instanceName: string): void {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`,
      );
    }
    this.defaultInstanceName = instanceName;
  }

  /**
   * Récupère la liste des instances disponibles
   */
  static getAvailableInstances(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * Réinitialise une instance ou toutes les instances
   */
  static resetInstance(instanceName?: string): void {
    if (instanceName) {
      this.instances.delete(instanceName);

      // Si l'instance par défaut a été supprimée, réinitialiser
      if (
        instanceName === this.defaultInstanceName &&
        this.instances.size > 0
      ) {
        this.defaultInstanceName =
          this.instances.keys().next().value ?? "default";
      }
    } else {
      // Réinitialiser toutes les instances
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }

  /**
   * Configure l'instance HTTP
   */
  private configure(options: HttpConfigOptions): void {
    // Configuration de base
    this.baseURL = this.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 10000;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;

    // Headers par défaut
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    };

    // Configuration des intercepteurs par défaut
    this.setupDefaultInterceptors();
  }

  /**
   * Construit l'URL de base complète
   */
  private getFullBaseUrl(options: HttpConfigOptions): string {
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }

    let baseUrl = options.baseURL.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    if (options.apiPrefix) {
      let prefix = options.apiPrefix.trim();
      if (!prefix.startsWith("/")) {
        prefix = "/" + prefix;
      }
      if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
      }

      return baseUrl + prefix;
    }

    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }

    return baseUrl;
  }

  /**
   * Configure les intercepteurs par défaut
   */
  private setupDefaultInterceptors(): void {
    // Ajouter un intercepteur d'erreur par défaut si aucun n'est configuré
    if (HttpClient.responseErrorInterceptors.length === 0) {
      HttpClient.responseErrorInterceptors.push((error) => {
        this.logError(error);
        return Promise.reject(error);
      });
    }
  }

  /**
   * Journalise les erreurs de requête
   */
  private logError(error: any): void {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.status,
      data: error.data,
      message: error.message,
    };

    console.error("API Request Error", errorDetails);
  }

  /**
   * Applique les intercepteurs de requête
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let interceptedConfig = { ...config };

    for (const interceptor of HttpClient.requestInterceptors) {
      interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
    }

    return interceptedConfig;
  }

  /**
   * Applique les intercepteurs de réponse réussie
   */
  private async applyResponseSuccessInterceptors(response: Response): Promise<Response> {
    let interceptedResponse = response;

    for (const interceptor of HttpClient.responseSuccessInterceptors) {
      interceptedResponse = await Promise.resolve(interceptor(interceptedResponse.clone()));
    }

    return interceptedResponse;
  }

  /**
   * Applique les intercepteurs d'erreur de réponse
   */
  private async applyResponseErrorInterceptors(error: any): Promise<any> {
    let interceptedError = error;

    for (const interceptor of HttpClient.responseErrorInterceptors) {
      try {
        interceptedError = await Promise.resolve(interceptor(interceptedError));
        // Si un intercepteur résout l'erreur, on arrête la chaîne
        if (!(interceptedError instanceof Error)) {
          return interceptedError;
        }
      } catch (e) {
        interceptedError = e;
      }
    }

    return Promise.reject(interceptedError);
  }

  /**
   * Détermine si une erreur est susceptible d'être réessayée
   */
  private isRetryableError(status: number, method?: string): boolean {
    const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());

    return (
      isIdempotent && (
        status === 0 || // Erreur réseau
        status === 429 || // Trop de requêtes
        (status >= 500 && status < 600) // Erreur serveur
      )
    );
  }

  /**
   * Effectue une requête avec gestion des tentatives
   */
  private async fetchWithRetry(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<Response> {
    try {
      // Préparer la configuration
      const { timeout = this.defaultTimeout, params, data, ...fetchOptions } = config;
      let fullUrl = url;

      // Ajouter les paramètres de requête s'ils existent
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value);
        }
        fullUrl += `?${queryParams.toString()}`;
      }

      // Configurer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('Request timeout'), timeout);

      // Préparer le corps de la requête
      let body: any = undefined;
      if (data !== undefined) {
        body = typeof data === 'string' ? data : JSON.stringify(data);
      }

      // Effectuer la requête
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        body,
        signal: controller.signal,
        credentials: this.withCredentials ? 'include' : 'same-origin',
      });

      clearTimeout(timeoutId);

      // Si la réponse n'est pas OK et que la tentative est possible
      if (!response.ok) {
        if (
          attempt < this.maxRetries &&
          this.isRetryableError(response.status, config.method)
        ) {
          // Attente exponentielle entre les tentatives
          const delay = Math.pow(2, attempt) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, config, attempt + 1);
        }
      }

      return response;

    } catch (error) {
      // Si c'est une erreur d'abandon due au timeout, convertir en erreur plus explicite
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${config.timeout || this.defaultTimeout}ms`);
      }

      // Si la tentative est possible pour les erreurs réseau
      if (attempt < this.maxRetries && this.isRetryableError(0, config.method)) {
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Méthode principale pour effectuer une requête
   */
  public async request<TResponse = any>(
    config: Partial<RequestConfig> & { url: string; },
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig: RequestConfig = {
        method: 'GET',
        timeout: this.defaultTimeout,
        ...config,
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(config.headers || {}),
          ...(options.headers || {})
        }
      };

      // Construire l'URL complète
      const url = new URL(
        mergedConfig.url.startsWith('http')
          ? mergedConfig.url
          : `${this.baseURL}${mergedConfig.url.startsWith('/') ? '' : '/'}${mergedConfig.url}`
      ).toString();

      // Appliquer les intercepteurs de requête
      const interceptedConfig = await this.applyRequestInterceptors({
        ...mergedConfig,
        url
      });

      // Effectuer la requête avec gestion des tentatives
      let response = await this.fetchWithRetry(url, interceptedConfig);

      // Appliquer les intercepteurs de réponse réussie
      response = await this.applyResponseSuccessInterceptors(response);

      // Traiter la réponse selon son type
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json() as TResponse;
      } else {
        return await response.text() as unknown as TResponse;
      }

    } catch (error) {
      // Créer une erreur API appropriée
      const apiError = error instanceof ApiRequestError
        ? error
        : new ApiRequestError(error, {
          ...config,
          ...options,
          url: config.url
        });

      // Appliquer les intercepteurs d'erreur
      return this.applyResponseErrorInterceptors(apiError);
    }
  }
}