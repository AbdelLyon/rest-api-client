import type { Application } from "../models/Application";
import { ApiService } from "./ApiService";

export class ApplicationService extends ApiService<Application> {
  private static instances: Map<string, ApplicationService> = new Map();

  private constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
  }

  static getInstance(domain: string, baseUrl: string): ApplicationService {
    const key = `${domain}:${baseUrl}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new ApplicationService(domain, baseUrl));
    }

    return this.instances.get(key) ?? new ApplicationService(domain, baseUrl);
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
