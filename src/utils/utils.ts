// src/tests/utils/axiosMock.ts
import { vi } from "vitest";
import type { AxiosInstance } from "axios";

export const createAxiosMock = (): Partial<AxiosInstance> => ({
  request: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
    },
  },
});
