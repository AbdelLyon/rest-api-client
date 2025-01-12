import type { Role } from "../models/User";
import { ApiService } from "./ApiService";

export class RoleService extends ApiService<Role> {
  private static instances: Map<string, RoleService> = new Map();

  private constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
  }

  static getInstance(domain: string, baseUrl: string): RoleService {
    const key = `${domain}:${baseUrl}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new RoleService(domain, baseUrl));
    }

    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(`Failed to get RoleService instance for ${key}`);
    }
    return instance;
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
