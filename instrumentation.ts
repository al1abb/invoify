import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "";
const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1");
const environment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV;

export function register() {
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment,
    tracesSampleRate,
  });
}

export const onRequestError = Sentry.captureRequestError;
