import type { RequestConfig } from "@/http/types";

// ==================== Interfaces ====================

export interface IAuth<TUser, TCredentials, TRegisterData, TToken> {
  register: (
    userData: TRegisterData,
    options?: Partial<RequestConfig>,
  ) => Promise<TUser>;

  login: (
    credentials: TCredentials,
    options?: Partial<RequestConfig>,
  ) => Promise<{
    user: TUser;
    tokens: TToken;
  }>;

  logout: (options?: Partial<RequestConfig>) => Promise<void>;

  refreshToken: (
    refreshToken: string,
    options?: Partial<RequestConfig>,
  ) => Promise<TToken>;

  getCurrentUser: (options?: Partial<RequestConfig>) => Promise<TUser>;
}
