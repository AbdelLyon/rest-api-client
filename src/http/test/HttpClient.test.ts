import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpClient } from "../HttpClient";

vi.mock("./common/HttpRequest", () => {
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
});
