import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSyncRuntimeConfigMock,
  createSupabaseRestSyncProviderMock,
  trackClientEventMock,
} = vi.hoisted(() => ({
  getSyncRuntimeConfigMock: vi.fn(),
  createSupabaseRestSyncProviderMock: vi.fn(),
  trackClientEventMock: vi.fn(),
}));

vi.mock("@/lib/sync/runtimeConfig", () => ({
  getSyncRuntimeConfig: getSyncRuntimeConfigMock,
}));

vi.mock("@/lib/sync/providers/supabaseRestSyncProvider", () => ({
  createSupabaseRestSyncProvider: createSupabaseRestSyncProviderMock,
}));

vi.mock("@/lib/telemetry/clientTelemetry", () => ({
  trackClientEvent: trackClientEventMock,
}));

import { createInvoiceSyncProvider } from "@/lib/sync/createInvoiceSyncProvider";
import { localSyncProvider } from "@/lib/sync/providers/localSyncProvider";
import { noopCloudSyncProvider } from "@/lib/sync/providers/noopCloudSyncProvider";

describe("createInvoiceSyncProvider", () => {
  beforeEach(() => {
    getSyncRuntimeConfigMock.mockReset();
    createSupabaseRestSyncProviderMock.mockReset();
    trackClientEventMock.mockReset();

    createSupabaseRestSyncProviderMock.mockReturnValue({
      name: "supabase-rest",
      isCloudProvider: true,
      pushSnapshot: vi.fn(),
      pullSnapshot: vi.fn(),
    });
  });

  it("returns local provider when local is configured", () => {
    getSyncRuntimeConfigMock.mockReturnValue({
      provider: "local",
      supabaseUrl: "",
      syncAnonKey: "",
    });

    const provider = createInvoiceSyncProvider();

    expect(provider).toBe(localSyncProvider);
    expect(trackClientEventMock).not.toHaveBeenCalled();
  });

  it("returns noop-cloud provider when noop-cloud is configured", () => {
    getSyncRuntimeConfigMock.mockReturnValue({
      provider: "noop-cloud",
      supabaseUrl: "",
      syncAnonKey: "",
    });

    const provider = createInvoiceSyncProvider();

    expect(provider).toBe(noopCloudSyncProvider);
    expect(trackClientEventMock).not.toHaveBeenCalled();
  });

  it("falls back to noop-cloud and tracks warning when supabase config is missing", () => {
    getSyncRuntimeConfigMock.mockReturnValue({
      provider: "supabase-rest",
      supabaseUrl: "",
      syncAnonKey: "",
    });

    const provider = createInvoiceSyncProvider();

    expect(provider).toBe(noopCloudSyncProvider);
    expect(trackClientEventMock).toHaveBeenCalledWith(
      "sync_provider_unavailable",
      expect.objectContaining({
        message: expect.stringContaining("supabase-rest selected"),
      }),
      "warn"
    );
  });

  it("builds supabase provider when supabase config is present", () => {
    const supabaseProvider = {
      name: "supabase-rest",
      isCloudProvider: true,
      pushSnapshot: vi.fn(),
      pullSnapshot: vi.fn(),
    };
    createSupabaseRestSyncProviderMock.mockReturnValue(supabaseProvider);

    getSyncRuntimeConfigMock.mockReturnValue({
      provider: "supabase-rest",
      supabaseUrl: "https://example.supabase.co",
      syncAnonKey: "anon-key",
    });

    const provider = createInvoiceSyncProvider();

    expect(createSupabaseRestSyncProviderMock).toHaveBeenCalledWith({
      supabaseUrl: "https://example.supabase.co",
      anonKey: "anon-key",
    });
    expect(provider).toBe(supabaseProvider);
    expect(trackClientEventMock).not.toHaveBeenCalled();
  });
});
