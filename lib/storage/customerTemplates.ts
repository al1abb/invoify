import { CustomerTemplateRecord, InvoiceType } from "@/types";

export const CUSTOMER_TEMPLATES_KEY_V1 = "invoify:customerTemplates:v1";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const safeRead = (key: string) => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: string) => {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const isTemplateArray = (value: unknown): value is CustomerTemplateRecord[] => {
  if (!Array.isArray(value)) return false;

  return value.every((record) => {
    return (
      typeof record === "object" &&
      record !== null &&
      typeof (record as CustomerTemplateRecord).id === "string" &&
      typeof (record as CustomerTemplateRecord).name === "string" &&
      typeof (record as CustomerTemplateRecord).createdAt === "number" &&
      typeof (record as CustomerTemplateRecord).updatedAt === "number" &&
      typeof (record as CustomerTemplateRecord).sender === "object" &&
      typeof (record as CustomerTemplateRecord).receiver === "object"
    );
  });
};

const cloneParty = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

export const readCustomerTemplates = (): CustomerTemplateRecord[] => {
  const raw = safeRead(CUSTOMER_TEMPLATES_KEY_V1);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!isTemplateArray(parsed)) return [];

    return [...parsed].sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
};

export const writeCustomerTemplates = (records: CustomerTemplateRecord[]) => {
  const sorted = [...records].sort((a, b) => b.updatedAt - a.updatedAt);
  return safeWrite(CUSTOMER_TEMPLATES_KEY_V1, JSON.stringify(sorted));
};

export const createCustomerTemplate = (
  name: string,
  sender: InvoiceType["sender"],
  receiver: InvoiceType["receiver"]
): CustomerTemplateRecord => {
  const now = Date.now();

  return {
    id: createId(),
    name: name.trim(),
    sender: cloneParty(sender),
    receiver: cloneParty(receiver),
    createdAt: now,
    updatedAt: now,
  };
};

export const addCustomerTemplate = (
  records: CustomerTemplateRecord[],
  name: string,
  sender: InvoiceType["sender"],
  receiver: InvoiceType["receiver"]
) => {
  const template = createCustomerTemplate(name, sender, receiver);
  return [template, ...records];
};

export const renameCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string,
  nextName: string
) => {
  const trimmedName = nextName.trim();
  if (!trimmedName) return records;

  const now = Date.now();

  return [...records]
    .map((record) =>
      record.id === id
        ? {
            ...record,
            name: trimmedName,
            updatedAt: now,
          }
        : record
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const removeCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string
) => {
  return records.filter((record) => record.id !== id);
};

export const findCustomerTemplate = (
  records: CustomerTemplateRecord[],
  id: string
) => {
  return records.find((record) => record.id === id) || null;
};
