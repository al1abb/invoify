export type ClientTelemetryLevel = "info" | "warn" | "error";

export type ClientTelemetryEventName =
  | "app_error"
  | "app_unhandled_rejection"
  | "sync_provider_unavailable"
  | "sync_push_failure"
  | "sync_push_retry"
  | "sync_push_skipped"
  | "sync_push_skipped_unauthenticated"
  | "sync_snapshot_skipped"
  | "sync_push_success"
  | "sync_pull_success"
  | "sync_pull_failure"
  | "sync_pull_skipped"
  | "sync_conflict_detected"
  | "sync_conflict_resolved"
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

const normalizeErrorPayload = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message || error.name || "Unknown error",
      stack: error.stack,
      errorName: error.name,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
};

const hasSentryClientDsn = () => {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
};

const captureSentryClientError = (
  name: ClientTelemetryEventName,
  error: unknown,
  payload?: Record<string, unknown>
) => {
  if (!isBrowser() || !hasSentryClientDsn()) return;

  void import("@sentry/nextjs")
    .then((Sentry) => {
      const exception =
        error instanceof Error
          ? error
          : new Error(
              typeof error === "string"
                ? error
                : payload?.message?.toString() || "Client telemetry error"
            );

      Sentry.withScope((scope) => {
        scope.setTag("telemetry_event", name);
        scope.setLevel("error");
        if (payload && Object.keys(payload).length > 0) {
          scope.setContext("telemetry_payload", payload);
        }
        Sentry.captureException(exception);
      });
    })
    .catch(() => {
      // no-op if sentry fails to load
    });
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
    const logPayload =
      payload && Object.keys(payload).length > 0
        ? payload
        : { info: "no-payload" };

    if (level === "warn" || level === "error") {
      console.warn(logLabel, logPayload);
    } else {
      console.info(logLabel, logPayload);
    }
  }
};

export const captureClientError = (
  name: ClientTelemetryEventName,
  error: unknown,
  payload?: Record<string, unknown>
) => {
  const normalized = normalizeErrorPayload(error);
  const mergedPayload = {
    ...payload,
    ...normalized,
  };

  trackClientEvent(name, mergedPayload, "error");
  captureSentryClientError(name, error, mergedPayload);
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
