import { BaseHttp } from "./BaseHttp";
import type { HttpConfig } from "./types/http";

export class HttpCLient {
  private static instances: Map<string, BaseHttp> = new Map();
  private static defaultInstanceName: string;

  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): BaseHttp {
    const { httpConfig, instanceName } = config;

    if (!this.instances.has(instanceName)) {
      const instance = new BaseHttp();
      instance.configure(httpConfig);
      this.instances.set(instanceName, instance);

      if (this.instances.size === 1) this.defaultInstanceName = instanceName;
    }

    return this.instances.get(instanceName)!;
  }

  static getInstance(instanceName?: string): BaseHttp {
    const name = instanceName || this.defaultInstanceName;

    if (!this.instances.has(name)) {
      throw new Error(
        `Http instance '${name}' not initialized. Call Http.init() first.`,
      );
    }
    return this.instances.get(name)!;
  }

  static setDefaultInstance(instanceName: string): void {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`,
      );
    }
    this.defaultInstanceName = instanceName;
  }

  static getAvailableInstances(): Array<string> {
    return Array.from(this.instances.keys());
  }

  static resetInstance(instanceName?: string): void {
    if (instanceName) {
      this.instances.delete(instanceName);

      if (
        instanceName === this.defaultInstanceName &&
        this.instances.size > 0
      ) {
        this.defaultInstanceName =
          this.instances.keys().next().value ?? "default";
      }
    } else {
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }
}
