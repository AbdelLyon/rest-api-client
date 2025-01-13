import { ApiService } from "./ApiService";
import type { Site } from "../models/Site";

export class SiteService extends ApiService<Site> {
  private static instances: Map<string, SiteService> = new Map();

  private constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
  }

  static getInstance(domain: string, baseUrl: string): SiteService {
    const key = `${domain}:${baseUrl}`;

    if (!this.instances.has(key)) {
      this.instances.set(key, new SiteService(domain, baseUrl));
    }

    return this.instances.get(key) ?? new SiteService(domain, baseUrl);
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
