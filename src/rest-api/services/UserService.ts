import { ApiService } from "./ApiService";
import type { User } from "../models/User";

export class UserService extends ApiService<User> {
  private static instances: Map<string, UserService> = new Map();

  private constructor(domain: string, pathname: string) {
    super(domain, pathname);
  }

  static getInstance(domain: string, pathname: string): UserService {
    const key = `${domain}:${pathname}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new UserService(domain, pathname));
    }

    return this.instances.get(key) ?? new UserService(domain, pathname);
  }

  static resetInstance(domain?: string, pathname?: string): void {
    if (
      domain !== undefined &&
      domain !== "" &&
      pathname !== undefined &&
      pathname !== ""
    ) {
      const key = `${domain}:${pathname}`;
      this.instances.delete(key);
    } else {
      this.instances.clear();
    }
  }
}
