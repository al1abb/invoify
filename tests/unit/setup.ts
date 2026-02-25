import "@testing-library/jest-dom/vitest";

import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});
