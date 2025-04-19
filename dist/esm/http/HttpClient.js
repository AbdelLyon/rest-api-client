var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { BaseHttp } from "./shared/BaseHttp.js";
class HttpCLient {
  static init(config) {
    const { httpConfig, instanceName } = config;
    if (!this.instances.has(instanceName)) {
      const instance = new BaseHttp();
      instance.configure(httpConfig);
      this.instances.set(instanceName, instance);
      if (this.instances.size === 1) this.defaultInstanceName = instanceName;
    }
    return this.instances.get(instanceName);
  }
  static getInstance(instanceName) {
    const name = instanceName || this.defaultInstanceName;
    if (!this.instances.has(name)) {
      throw new Error(
        `Http instance '${name}' not initialized. Call Http.init() first.`
      );
    }
    return this.instances.get(name);
  }
  static setDefaultInstance(instanceName) {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`
      );
    }
    this.defaultInstanceName = instanceName;
  }
  static getAvailableInstances() {
    return Array.from(this.instances.keys());
  }
  static resetInstance(instanceName) {
    if (instanceName) {
      this.instances.delete(instanceName);
      if (instanceName === this.defaultInstanceName && this.instances.size > 0) {
        this.defaultInstanceName = this.instances.keys().next().value ?? "default";
      }
    } else {
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }
}
__publicField(HttpCLient, "instances", /* @__PURE__ */ new Map());
__publicField(HttpCLient, "defaultInstanceName");
export {
  HttpCLient
};
//# sourceMappingURL=HttpClient.js.map
