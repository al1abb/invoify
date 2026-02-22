export type ClientTelemetryLevel = "info" | "warn" | "error";

export type ClientTelemetryEventName =
  | "app_error"
  | "app_unhandled_rejection"
  | "sync_provider_unavailable"
  | "sync_push_failure"
  | "sync_snapshot_skipped"
  | "sync_push_success"
  | "pdf_generate_success"
  | "pdf_generate_failure"
  | "pdf_cache_write_failure"
  | "pdf_cache_restore_failure"
  | "email_send_success"
  | "email_send_failure"
  | "invoice_import_failure";

export type ClientTelemetryEvent = {
  id: string;
  name: ClientTelemetryEventName;
  level: ClientTelemetryLevel;
  timestamp: number;
  payload?: Record<string, unknown>;
};

const TELEMETRY_STORAGE_KEY = "invoify:telemetry:v1";
const MAX_TELEMETRY_EVENTS = 200;

const isBrowser = () => typeof window !== "undefined";

const safeReadEvents = (): ClientTelemetryEvent[] => {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ClientTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const safeWriteEvents = (events: ClientTelemetryEvent[]) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // no-op: storage may be unavailable
  }
};

const createEventId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const trackClientEvent = (
  name: ClientTelemetryEventName,
  payload?: Record<string, unknown>,
  level: ClientTelemetryLevel = "info"
) => {
  if (!isBrowser()) return;

  const event: ClientTelemetryEvent = {
    id: createEventId(),
    name,
    level,
    timestamp: Date.now(),
    payload,
  };

  const next = [event, ...safeReadEvents()].slice(0, MAX_TELEMETRY_EVENTS);
  safeWriteEvents(next);

  if (process.env.NODE_ENV !== "production") {
    const logLabel = `[telemetry:${level}] ${name}`;
    if (level === "error") {
      console.error(logLabel, payload || {});
    } else if (level === "warn") {
      console.warn(logLabel, payload || {});
    } else {
      console.info(logLabel, payload || {});
    }
  }
};

export const captureClientError = (
  name: ClientTelemetryEventName,
  error: unknown,
  payload?: Record<string, unknown>
) => {
  trackClientEvent(
    name,
    {
      ...payload,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
    "error"
  );
};

export const listClientTelemetryEvents = () => {
  return safeReadEvents();
};

export const clearClientTelemetryEvents = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(TELEMETRY_STORAGE_KEY);
  } catch {
    // no-op
  }
};
