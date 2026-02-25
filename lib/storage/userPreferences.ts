import { trackClientEvent } from "@/lib/telemetry/clientTelemetry";
import {
  DEFAULT_LOCALE,
  FORM_DEFAULT_VALUES,
} from "@/lib/variables";
import { InvoiceType, UserPreferences } from "@/types";

import {
  backupCorruptedLocalStorage,
  safeParseJson,
  safeReadLocalStorage,
  safeWriteLocalStorage,
} from "@/lib/storage/localStorage";

export const USER_PREFERENCES_KEY_V1 = "invoify:userPreferences:v1";

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultCurrency: FORM_DEFAULT_VALUES.details.currency,
  defaultTemplateId: FORM_DEFAULT_VALUES.details.pdfTemplate,
  defaultLocale: DEFAULT_LOCALE,
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toTemplateId = (value: unknown, fallback: number) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : fallback;

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeUserPreferences = (value: unknown): UserPreferences | null => {
  if (!isRecord(value)) return null;

  return {
    defaultCurrency:
      typeof value.defaultCurrency === "string" && value.defaultCurrency.trim()
        ? value.defaultCurrency.trim()
        : DEFAULT_USER_PREFERENCES.defaultCurrency,
    defaultTemplateId: toTemplateId(
      value.defaultTemplateId,
      DEFAULT_USER_PREFERENCES.defaultTemplateId
    ),
    defaultLocale:
      typeof value.defaultLocale === "string" && value.defaultLocale.trim()
        ? value.defaultLocale.trim()
        : DEFAULT_USER_PREFERENCES.defaultLocale,
  };
};

export const readUserPreferences = (): UserPreferences => {
  const raw = safeReadLocalStorage(USER_PREFERENCES_KEY_V1);
  if (!raw) return DEFAULT_USER_PREFERENCES;

  const parsed = safeParseJson(raw);
  if (!parsed.ok) {
    const backupKey = backupCorruptedLocalStorage(
      USER_PREFERENCES_KEY_V1,
      "user_preferences",
      raw
    );
    trackClientEvent(
      "storage_corruption_recovered",
      {
        storageArea: "user_preferences",
        storageKey: USER_PREFERENCES_KEY_V1,
        backupKey,
        reason: "invalid_json",
      },
      "warn"
    );
    return DEFAULT_USER_PREFERENCES;
  }

  const normalized = normalizeUserPreferences(parsed.data);
  if (!normalized) {
    const backupKey = backupCorruptedLocalStorage(
      USER_PREFERENCES_KEY_V1,
      "user_preferences",
      raw
    );
    trackClientEvent(
      "storage_corruption_recovered",
      {
        storageArea: "user_preferences",
        storageKey: USER_PREFERENCES_KEY_V1,
        backupKey,
        reason: "invalid_shape",
      },
      "warn"
    );
    return DEFAULT_USER_PREFERENCES;
  }

  return normalized;
};

export const writeUserPreferences = (preferences: UserPreferences) => {
  const normalized = normalizeUserPreferences(preferences);
  if (!normalized) return false;

  return safeWriteLocalStorage(
    USER_PREFERENCES_KEY_V1,
    JSON.stringify(normalized)
  );
};

export const updateUserPreferences = (partial: Partial<UserPreferences>) => {
  const current = readUserPreferences();
  return writeUserPreferences({
    ...current,
    ...partial,
  });
};

export const applyUserPreferencesToInvoice = (
  invoice: InvoiceType,
  preferences: UserPreferences
): InvoiceType => {
  const next = JSON.parse(JSON.stringify(invoice)) as InvoiceType;

  next.details.currency =
    preferences.defaultCurrency || FORM_DEFAULT_VALUES.details.currency;
  next.details.pdfTemplate =
    preferences.defaultTemplateId || FORM_DEFAULT_VALUES.details.pdfTemplate;
  next.details.language =
    preferences.defaultLocale || FORM_DEFAULT_VALUES.details.language;

  return next;
};

export const getDefaultUserPreferences = () => {
  return DEFAULT_USER_PREFERENCES;
};
