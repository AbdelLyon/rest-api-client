import type { User } from "../models/User";
import { ApiService } from "./ApiService";

export class UserService extends ApiService<User> {
  private static instances: Map<string, UserService> = new Map();

  private constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
  }

  static getInstance(domain: string, baseUrl: string): UserService {
    const key = `${domain}:${baseUrl}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new UserService(domain, baseUrl));
    }

    return this.instances.get(key) ?? new UserService(domain, baseUrl);
  }

  static resetInstance(domain?: string, baseUrl?: string): void {
    if (
      domain !== undefined &&
      domain !== "" &&
      baseUrl !== undefined &&
      baseUrl !== ""
    ) {
      const key = `${domain}:${baseUrl}`;
      this.instances.delete(key);
    } else {
      this.instances.clear();
    }
  }
}
