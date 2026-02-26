import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useInvoiceSyncState } from "@/contexts/invoice/useInvoiceSyncState";
import { CustomerTemplateRecord, SavedInvoiceRecord } from "@/types";

const {
  createInvoiceSyncProviderMock,
  getSyncRuntimeConfigMock,
  trackClientEventMock,
  captureClientErrorMock,
  mergeRemoteSnapshotWithLocalMock,
} = vi.hoisted(() => ({
  createInvoiceSyncProviderMock: vi.fn(),
  getSyncRuntimeConfigMock: vi.fn(),
  trackClientEventMock: vi.fn(),
  captureClientErrorMock: vi.fn(),
  mergeRemoteSnapshotWithLocalMock: vi.fn(),
}));

vi.mock("@/lib/sync/createInvoiceSyncProvider", () => ({
  createInvoiceSyncProvider: createInvoiceSyncProviderMock,
}));

vi.mock("@/lib/sync/runtimeConfig", () => ({
  getSyncRuntimeConfig: getSyncRuntimeConfigMock,
}));

vi.mock("@/lib/telemetry/clientTelemetry", () => ({
  trackClientEvent: trackClientEventMock,
  captureClientError: captureClientErrorMock,
}));

vi.mock("@/lib/sync/merge", async () => {
  const actual = await vi.importActual<typeof import("@/lib/sync/merge")>(
    "@/lib/sync/merge"
  );

  return {
    ...actual,
    mergeRemoteSnapshotWithLocal: mergeRemoteSnapshotWithLocalMock,
  };
});

const createSavedInvoice = (
  overrides: Partial<SavedInvoiceRecord> = {}
): SavedInvoiceRecord => {
  const id = overrides.id || "invoice-1";
  const invoiceNumber = overrides.invoiceNumber || "INV-1";

  return {
    id,
    invoiceNumber,
    status: "draft",
    createdAt: 1,
    updatedAt: 1,
    data: {
      sender: {
        name: "Sender",
        address: "Address",
        zipCode: "12345",
        city: "City",
        country: "Country",
        email: "sender@example.com",
        phone: "123",
        customInputs: [],
      },
      receiver: {
        name: "Receiver",
        address: "Address",
        zipCode: "12345",
        city: "City",
        country: "Country",
        email: "receiver@example.com",
        phone: "456",
        customInputs: [],
      },
      details: {
        invoiceLogo: "",
        invoiceNumber,
        invoiceDate: "2026-02-01",
        dueDate: "2026-03-01",
        purchaseOrderNumber: "",
        currency: "USD",
        language: "en",
        items: [],
        paymentInformation: {
          bankName: "Bank",
          accountName: "Account",
          accountNumber: "123",
        },
        taxDetails: {
          amount: 0,
          taxID: "",
          amountType: "amount",
        },
        discountDetails: {
          amount: 0,
          amountType: "amount",
        },
        shippingDetails: {
          cost: 0,
          costType: "amount",
        },
        subTotal: 0,
        totalAmount: 0,
        totalAmountInWords: "zero",
        additionalNotes: "",
        paymentTerms: "Due on receipt",
        updatedAt: "",
        pdfTemplate: 1,
      },
    },
    recurring: {
      enabled: false,
      frequency: null,
      baseInvoiceNumber: invoiceNumber,
      counter: 0,
      lastIssuedAt: null,
      nextIssueAt: null,
    },
    payment: {
      amountPaid: 0,
      lastPaymentAt: null,
    },
    reminder: {
      enabled: true,
      lastSentAt: null,
      sendCount: 0,
      nextReminderAt: null,
    },
    timeline: [],
    ...overrides,
  };
};

const createTemplate = (
  overrides: Partial<CustomerTemplateRecord> = {}
): CustomerTemplateRecord => {
  return {
    id: overrides.id || "template-1",
    name: overrides.name || "Template 1",
    sender: {
      name: "Sender",
      address: "Address",
      zipCode: "12345",
      city: "City",
      country: "Country",
      email: "sender@example.com",
      phone: "123",
      customInputs: [],
    },
    receiver: {
      name: "Receiver",
      address: "Address",
      zipCode: "54321",
      city: "City",
      country: "Country",
      email: "receiver@example.com",
      phone: "456",
      customInputs: [],
    },
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  };
};

const createMockProvider = (overrides?: {
  isCloudProvider?: boolean;
  pushSnapshot?: ReturnType<typeof vi.fn>;
  pullSnapshot?: ReturnType<typeof vi.fn>;
}) => {
  return {
    name: "supabase-rest" as const,
    isCloudProvider: overrides?.isCloudProvider ?? true,
    pushSnapshot:
      overrides?.pushSnapshot ||
      vi.fn().mockResolvedValue({
        status: "pushed",
        provider: "supabase-rest",
      }),
    pullSnapshot:
      overrides?.pullSnapshot ||
      vi.fn().mockResolvedValue({
        status: "skipped",
        provider: "supabase-rest",
        reason: "remote_snapshot_missing",
      }),
  };
};

const getDefaultRuntimeConfig = (overrides?: Record<string, unknown>) => ({
  provider: "supabase-rest",
  debounceMs: 10,
  maxInvoices: 250,
  maxTemplates: 100,
  maxPayloadBytes: 524288,
  retryMaxAttempts: 3,
  retryBaseDelayMs: 1,
  supabaseUrl: "https://example.supabase.co",
  syncAnonKey: "anon-key",
  ...(overrides || {}),
});

describe("useInvoiceSyncState", () => {
  beforeEach(() => {
    createInvoiceSyncProviderMock.mockReset();
    getSyncRuntimeConfigMock.mockReset();
    trackClientEventMock.mockReset();
    captureClientErrorMock.mockReset();
    mergeRemoteSnapshotWithLocalMock.mockReset();

    mergeRemoteSnapshotWithLocalMock.mockImplementation(
      ({ localSavedInvoices, localCustomerTemplates }) => ({
        savedInvoices: localSavedInvoices,
        customerTemplates: localCustomerTemplates,
        conflicts: [],
      })
    );

    getSyncRuntimeConfigMock.mockReturnValue(getDefaultRuntimeConfig());
  });

  it("tracks unauthenticated skip event when provider skips push without auth", async () => {
    const pushSnapshot = vi.fn().mockResolvedValue({
      status: "skipped",
      provider: "supabase-rest",
      reason: "unauthenticated_no_token",
    });
    const provider = createMockProvider({
      isCloudProvider: true,
      pushSnapshot,
    });

    createInvoiceSyncProviderMock.mockReturnValue(provider);
    getSyncRuntimeConfigMock.mockReturnValue(
      getDefaultRuntimeConfig({
        debounceMs: 1,
      })
    );

    const persistSavedInvoices = vi.fn();
    const persistCustomerTemplates = vi.fn();
    const savedInvoices = [createSavedInvoice()];
    const customerTemplates: CustomerTemplateRecord[] = [];

    const { result, unmount } = renderHook(() =>
      useInvoiceSyncState({
        isStorageHydrated: true,
        savedInvoices,
        customerTemplates,
        persistSavedInvoices,
        persistCustomerTemplates,
        accessToken: null,
        isAuthenticated: false,
        userId: null,
      })
    );

    await waitFor(() => {
      expect(pushSnapshot).toHaveBeenCalledTimes(1);
      expect(result.current.syncStatus.state).toBe("skipped");
      expect(result.current.syncStatus.reason).toBe("unauthenticated_no_token");
    });

    expect(trackClientEventMock).toHaveBeenCalledWith(
      "sync_push_skipped_unauthenticated",
      expect.objectContaining({
        provider: "supabase-rest",
        reason: "unauthenticated_no_token",
      }),
      "warn"
    );

    unmount();
  });

  it("skips sync when payload exceeds cap and does not call push", async () => {
    const pushSnapshot = vi.fn().mockResolvedValue({
      status: "pushed",
      provider: "supabase-rest",
    });
    const provider = createMockProvider({
      isCloudProvider: false,
      pushSnapshot,
    });

    createInvoiceSyncProviderMock.mockReturnValue(provider);
    getSyncRuntimeConfigMock.mockReturnValue(
      getDefaultRuntimeConfig({
        debounceMs: 1,
        maxPayloadBytes: 1,
      })
    );
    const savedInvoices = [createSavedInvoice()];
    const customerTemplates = [createTemplate()];

    const { result, unmount } = renderHook(() =>
      useInvoiceSyncState({
        isStorageHydrated: true,
        savedInvoices,
        customerTemplates,
        persistSavedInvoices: vi.fn(),
        persistCustomerTemplates: vi.fn(),
        accessToken: null,
        isAuthenticated: false,
        userId: null,
      })
    );

    await waitFor(() => {
      expect(result.current.syncStatus.state).toBe("skipped");
      expect(result.current.syncStatus.reason).toBe("payload_too_large");
    });

    expect(pushSnapshot).not.toHaveBeenCalled();
    expect(trackClientEventMock).toHaveBeenCalledWith(
      "sync_snapshot_skipped",
      expect.objectContaining({
        provider: "supabase-rest",
        maxPayloadBytes: 1,
      }),
      "warn"
    );

    unmount();
  });

  it("resolves pull conflicts using default choices", async () => {
    const localInvoice = createSavedInvoice({
      id: "inv-local",
      invoiceNumber: "INV-200",
      updatedAt: 10,
      status: "sent",
    });
    const cloudInvoice = createSavedInvoice({
      id: "inv-cloud",
      invoiceNumber: "INV-200",
      updatedAt: 20,
      status: "paid",
    });

    const provider = createMockProvider({
      isCloudProvider: true,
      pullSnapshot: vi.fn().mockResolvedValue({
        status: "pulled",
        provider: "supabase-rest",
        snapshot: {
          reason: "pull_on_login",
          timestamp: 1700000000000,
          savedInvoices: [cloudInvoice],
          customerTemplates: [],
        },
        remoteUpdatedAt: 1700000000000,
      }),
    });

    createInvoiceSyncProviderMock.mockReturnValue(provider);
    getSyncRuntimeConfigMock.mockReturnValue(
      getDefaultRuntimeConfig({
        debounceMs: 10_000,
      })
    );

    mergeRemoteSnapshotWithLocalMock.mockReturnValue({
      savedInvoices: [cloudInvoice],
      customerTemplates: [],
      conflicts: [
        {
          id: "invoice:INV-200",
          entityType: "invoice",
          key: "INV-200",
          label: "INV-200",
          localUpdatedAt: 10,
          cloudUpdatedAt: 20,
          defaultChoice: "cloud",
          localVersion: localInvoice,
          cloudVersion: cloudInvoice,
        },
      ],
    });

    const persistSavedInvoices = vi.fn();
    const persistCustomerTemplates = vi.fn();
    const savedInvoices = [localInvoice];
    const customerTemplates: CustomerTemplateRecord[] = [];

    const { result, unmount } = renderHook(() =>
      useInvoiceSyncState({
        isStorageHydrated: true,
        savedInvoices,
        customerTemplates,
        persistSavedInvoices,
        persistCustomerTemplates,
        accessToken: "token",
        isAuthenticated: true,
        userId: "user-1",
      })
    );

    await waitFor(() => {
      expect(result.current.syncConflicts).toHaveLength(1);
    });

    let resolvedCount = 0;
    act(() => {
      resolvedCount = result.current.resolveSyncConflictsWithDefaults();
    });

    expect(resolvedCount).toBe(1);
    expect(persistSavedInvoices).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "inv-cloud",
          status: "paid",
        }),
      ]),
      "resolve_sync_conflicts_defaults"
    );
    expect(persistCustomerTemplates).toHaveBeenCalledWith(
      [],
      "resolve_sync_conflicts_defaults"
    );

    await waitFor(() => {
      expect(result.current.syncConflicts).toHaveLength(0);
      expect(result.current.syncStatus.reason).toBeNull();
    });

    expect(trackClientEventMock).toHaveBeenCalledWith(
      "sync_conflict_resolved",
      expect.objectContaining({
        strategy: "defaults",
        totalResolved: 1,
      })
    );

    unmount();
  });
});
