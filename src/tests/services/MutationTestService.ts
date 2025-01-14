import type { User } from "@/rest-api/models";
import { MutationService } from "@/rest-api/services/MutationService";

export class UserTestService extends MutationService<User> {
  private static instances: Map<string, UserTestService> = new Map();

  private constructor(domain: string, pathname: string) {
    super(domain, pathname);
  }

  static getInstance(domain: string, pathname: string): UserTestService {
    const key = `${domain}:${pathname}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new UserTestService(domain, pathname));
    }

    return this.instances.get(key) ?? new UserTestService(domain, pathname);
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
