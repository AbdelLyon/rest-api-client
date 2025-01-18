import type { AxiosInstance } from "axios";
import type { User } from "@/rest-api/models";
import { Query } from "@/rest-api/services";

export class QueryTestService extends Query<User> {
  private static instances: Map<string, QueryTestService> = new Map();

  private constructor(pathname: string) {
    super(pathname);
  }

  static getInstance(pathname: string): QueryTestService {
    if (!this.instances.has(pathname)) {
      this.instances.set(pathname, new QueryTestService(pathname));
    }

    return this.instances.get(pathname) ?? new QueryTestService(pathname);
  }

  static resetInstance(pathname?: string): void {
    if (pathname !== undefined && pathname !== "") {
      this.instances.delete(pathname);
    } else {
      this.instances.clear();
    }
  }

  public _setAxiosInstanceForTesting(axiosInstance: AxiosInstance): void {
    this.setAxiosInstance(axiosInstance);
  }
}
