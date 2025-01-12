import type { Client } from "../models/Client";
import { ApiService } from "./ApiService";

export class ClientService extends ApiService<Client> {
  private static instances: Map<string, ClientService> = new Map();

  private constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
  }

  static getInstance(domain: string, baseUrl: string): ClientService {
    const key = `${domain}:${baseUrl}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new ClientService(domain, baseUrl));
    }

    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(
        `Failed to get or create ClientService instance for ${key}`,
      );
    }
    return instance;
  }

  static resetInstance(domain?: string, baseUrl?: string): void {
    if (
      typeof domain === "string" &&
      domain !== "" &&
      typeof baseUrl === "string" &&
      baseUrl !== ""
    ) {
      const key = `${domain}:${baseUrl}`;
      this.instances.delete(key);
    } else {
      this.instances.clear();
    }
  }
}
