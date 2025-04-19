export type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;

// Type pour les intercepteurs de réponse réussie
export type ResponseSuccessInterceptor = (response: Response) => Promise<Response> | Response;

// Type pour les intercepteurs d'erreur
export type ResponseErrorInterceptor = (error: any) => Promise<any>;

// Paramètres de pagination
export interface PaginationParams {
   page?: number;
   limit?: number;
}

// Configuration de base pour le client HTTP
export interface HttpConfigOptions {
   baseURL: string;
   timeout?: number;
   headers?: Record<string, string>;
   withCredentials?: boolean;
   maxRetries?: number;
   apiPrefix?: string;
   apiVersion?: string | number;
}

// Structure de permissions
export interface Permission {
   authorized_to_view: boolean;
   authorized_to_create: boolean;
   authorized_to_update: boolean;
   authorized_to_delete: boolean;
   authorized_to_restore: boolean;
   authorized_to_force_delete: boolean;
}

// Configuration de requête étendue
export interface RequestConfig extends RequestInit {
   url: string;
   params?: Record<string, string>;
   data?: any;
   timeout?: number;
   baseURL?: string;
   headers?: Record<string, string>;
}

export interface ApiErrorSource {
   [key: string]: unknown;
   status?: number;
   statusText?: string;
   data?: unknown;
   response?: Response;
}




export interface HttpConfig extends HttpConfigOptions {
   interceptors?: {
      request?: RequestInterceptor[];
      response?: {
         success?: ResponseSuccessInterceptor[];
         error?: ResponseErrorInterceptor[];
      };
   };
}