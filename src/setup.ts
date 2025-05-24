import { vi } from "vitest";

global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
