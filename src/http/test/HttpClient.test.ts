/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpClient } from "../HttpClient";
import { HttpRequest } from "../request/HttpRequest";

vi.mock("../request/HttpRequest", () => {
  return {
    HttpRequest: vi.fn().mockImplementation(() => ({
      configure: vi.fn(),
      request: vi.fn(),
    })),
  };
});

describe("HttpClient", () => {
  beforeEach(() => {
    HttpClient.resetInstance();
    vi.clearAllMocks();
  });

  it("should retrieve an existing instance", () => {
    const httpConfig = { baseURL: "https://api.example.com" };
    const initialInstance = HttpClient.init({
      httpConfig,
      instanceName: "test",
    });
    const retrievedInstance = HttpClient.getInstance("test");

    expect(retrievedInstance).toBe(initialInstance);
  });

  it("should throw error when getting non-existent instance", () => {
    expect(() => HttpClient.getInstance("nonexistent")).toThrow(
      "Http instance 'nonexistent' not initialized. Call Http.init() first.",
    );
  });

  it("should set a default instance", () => {
    const httpConfig = { baseURL: "https://api.example.com" };
    HttpClient.init({ httpConfig, instanceName: "test1" });
    HttpClient.init({ httpConfig, instanceName: "test2" });

    HttpClient.setDefaultInstance("test2");
    const defaultInstance = HttpClient.getInstance();

    expect(defaultInstance).toBeDefined();
    expect(HttpClient.getAvailableInstances()).toContain("test2");
  });

  it("should throw error when setting non-existent instance as default", () => {
    expect(() => HttpClient.setDefaultInstance("nonexistent")).toThrow(
      "Cannot set default: Http instance 'nonexistent' not initialized.",
    );
  });

  it("should get available instances", () => {
    const httpConfig = { baseURL: "https://api.example.com" };
    HttpClient.init({ httpConfig, instanceName: "test1" });
    HttpClient.init({ httpConfig, instanceName: "test2" });

    const instances = HttpClient.getAvailableInstances();

    expect(instances).toHaveLength(2);
    expect(instances).toContain("test1");
    expect(instances).toContain("test2");
  });

  it("should reset specific instance", () => {
    const httpConfig = { baseURL: "https://api.example.com" };
    HttpClient.init({ httpConfig, instanceName: "test1" });
    HttpClient.init({ httpConfig, instanceName: "test2" });

    HttpClient.resetInstance("test1");
    const instances = HttpClient.getAvailableInstances();

    expect(instances).toHaveLength(1);
    expect(instances).toContain("test2");
  });

  it("should reset all instances", () => {
    const httpConfig = { baseURL: "https://api.example.com" };
    HttpClient.init({ httpConfig, instanceName: "test1" });
    HttpClient.init({ httpConfig, instanceName: "test2" });

    HttpClient.resetInstance();
    const instances = HttpClient.getAvailableInstances();

    expect(instances).toHaveLength(0);
  });

  describe("init method", () => {
    it("should create and configure a new instance", () => {
      const httpConfig = { baseURL: "https://api.example.com" };
      const mockConfigure = vi.fn();

      vi.mocked(HttpRequest).mockImplementation(
        () =>
          ({
            configure: mockConfigure,
            request: vi.fn(),
          }) as any,
      );

      const instance = HttpClient.init({
        httpConfig,
        instanceName: "test",
      });

      expect(mockConfigure).toHaveBeenCalledWith(httpConfig);
      expect(instance).toBeDefined();
    });

    it("should not recreate existing instance", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      const firstInstance = HttpClient.init({
        httpConfig,
        instanceName: "test",
      });

      const secondInstance = HttpClient.init({
        httpConfig,
        instanceName: "test",
      });

      expect(firstInstance).toBe(secondInstance);
      expect(HttpRequest).toHaveBeenCalledTimes(1);
    });

    it("should set first instance as default", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "first",
      });

      const defaultInstance = HttpClient.getInstance();
      const namedInstance = HttpClient.getInstance("first");

      expect(defaultInstance).toBe(namedInstance);
    });

    it("should handle multiple instances with different configs", () => {
      const config1 = { baseURL: "https://api1.example.com" };
      const config2 = { baseURL: "https://api2.example.com" };

      HttpClient.init({
        httpConfig: config1,
        instanceName: "api1",
      });

      HttpClient.init({
        httpConfig: config2,
        instanceName: "api2",
      });

      expect(HttpClient.getAvailableInstances()).toHaveLength(2);
      expect(HttpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe("getInstance default behavior", () => {
    it("should return default instance when no name provided", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      const instance = HttpClient.init({
        httpConfig,
        instanceName: "default-test",
      });

      const retrievedInstance = HttpClient.getInstance();

      expect(retrievedInstance).toBe(instance);
    });

    it("should throw error when no instances exist", () => {
      expect(() => HttpClient.getInstance()).toThrow(
        "Http instance 'default' not initialized. Call Http.init() first.",
      );
    });

    it("should use specified name over default", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "instance1",
      });

      HttpClient.init({
        httpConfig,
        instanceName: "instance2",
      });

      const instance2 = HttpClient.getInstance("instance2");

      expect(instance2).toBe(HttpClient.getInstance("instance2"));
    });
  });

  describe("resetInstance edge cases", () => {
    it("should update default instance when current default is deleted", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "first",
      });

      HttpClient.init({
        httpConfig,
        instanceName: "second",
      });

      HttpClient.init({
        httpConfig,
        instanceName: "third",
      });

      // First instance is default
      HttpClient.resetInstance("first");

      // Should have a new default (next available)
      const defaultInstance = HttpClient.getInstance();
      expect(defaultInstance).toBeDefined();
      expect(HttpClient.getAvailableInstances()).not.toContain("first");
    });

    it("should handle deleting non-default instance", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "default-instance",
      });

      HttpClient.init({
        httpConfig,
        instanceName: "other-instance",
      });

      const defaultBefore = HttpClient.getInstance();
      HttpClient.resetInstance("other-instance");
      const defaultAfter = HttpClient.getInstance();

      expect(defaultBefore).toBe(defaultAfter);
      expect(HttpClient.getAvailableInstances()).not.toContain(
        "other-instance",
      );
    });

    it("should handle resetting non-existent instance", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "test",
      });

      const instancesBefore = HttpClient.getAvailableInstances().length;
      HttpClient.resetInstance("non-existent");
      const instancesAfter = HttpClient.getAvailableInstances().length;

      expect(instancesBefore).toBe(instancesAfter);
    });

    it("should reset to 'default' when all instances cleared", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "test1",
      });

      HttpClient.init({
        httpConfig,
        instanceName: "test2",
      });

      HttpClient.resetInstance();

      expect(HttpClient.getAvailableInstances()).toHaveLength(0);

      // Next init should set default correctly
      HttpClient.init({
        httpConfig,
        instanceName: "new-instance",
      });

      const defaultInstance = HttpClient.getInstance();
      expect(defaultInstance).toBeDefined();
    });

    it("should handle edge case when no more instances after deletion", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({
        httpConfig,
        instanceName: "only-instance",
      });

      HttpClient.resetInstance("only-instance");

      expect(HttpClient.getAvailableInstances()).toHaveLength(0);
      expect(() => HttpClient.getInstance()).toThrow();
    });
  });

  describe("multiple default instance changes", () => {
    it("should handle multiple default changes", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      HttpClient.init({ httpConfig, instanceName: "instance1" });
      HttpClient.init({ httpConfig, instanceName: "instance2" });
      HttpClient.init({ httpConfig, instanceName: "instance3" });

      // Change default multiple times
      HttpClient.setDefaultInstance("instance2");
      let defaultInstance = HttpClient.getInstance();
      expect(HttpClient.getInstance("instance2")).toBe(defaultInstance);

      HttpClient.setDefaultInstance("instance3");
      defaultInstance = HttpClient.getInstance();
      expect(HttpClient.getInstance("instance3")).toBe(defaultInstance);

      HttpClient.setDefaultInstance("instance1");
      defaultInstance = HttpClient.getInstance();
      expect(HttpClient.getInstance("instance1")).toBe(defaultInstance);
    });
  });

  describe("static properties state", () => {
    it("should maintain state across different test scenarios", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      // Create instances
      HttpClient.init({ httpConfig, instanceName: "persistent1" });
      HttpClient.init({ httpConfig, instanceName: "persistent2" });

      // Verify state
      expect(HttpClient.getAvailableInstances()).toHaveLength(2);

      // Partial reset
      HttpClient.resetInstance("persistent1");
      expect(HttpClient.getAvailableInstances()).toHaveLength(1);

      // Add new instance
      HttpClient.init({ httpConfig, instanceName: "persistent3" });
      expect(HttpClient.getAvailableInstances()).toHaveLength(2);

      // Full reset
      HttpClient.resetInstance();
      expect(HttpClient.getAvailableInstances()).toHaveLength(0);
    });
  });

  describe("integration with HttpRequest", () => {
    it("should pass through request calls to instance", async () => {
      const mockRequest = vi.fn().mockResolvedValue({ data: "test" });
      const mockConfigure = vi.fn();

      vi.mocked(HttpRequest).mockImplementation(
        () =>
          ({
            configure: mockConfigure,
            request: mockRequest,
          }) as any,
      );

      const httpConfig = {
        baseURL: "https://api.example.com",
        timeout: 5000,
        headers: { "X-Custom": "value" },
      };

      HttpClient.init({ httpConfig, instanceName: "test" });
      const instance = HttpClient.getInstance("test");

      // Make a request
      const result = await instance.request({ url: "/test" });

      expect(mockConfigure).toHaveBeenCalledWith(httpConfig);
      expect(mockRequest).toHaveBeenCalledWith({ url: "/test" });
      expect(result).toEqual({ data: "test" });
    });
  });

  describe("empty instance name handling", () => {
    it("should handle empty string as instance name", () => {
      const httpConfig = { baseURL: "https://api.example.com" };

      const instance = HttpClient.init({
        httpConfig,
        instanceName: "",
      });

      expect(instance).toBeDefined();
      expect(HttpClient.getInstance("")).toBe(instance);
      expect(HttpClient.getAvailableInstances()).toContain("");
    });
  });
});
