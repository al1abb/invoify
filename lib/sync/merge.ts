import {
  CustomerTemplateRecord,
  SavedInvoiceRecord,
  SyncConflictChoice,
  SyncConflictSummary,
} from "@/types";

export type SyncConflictRecord =
  | {
      id: string;
      entityType: "invoice";
      key: string;
      label: string;
      localUpdatedAt: number;
      cloudUpdatedAt: number;
      defaultChoice: SyncConflictChoice;
      localVersion: SavedInvoiceRecord;
      cloudVersion: SavedInvoiceRecord;
    }
  | {
      id: string;
      entityType: "template";
      key: string;
      label: string;
      localUpdatedAt: number;
      cloudUpdatedAt: number;
      defaultChoice: SyncConflictChoice;
      localVersion: CustomerTemplateRecord;
      cloudVersion: CustomerTemplateRecord;
    };

type MergeSnapshotArgs = {
  localSavedInvoices: SavedInvoiceRecord[];
  remoteSavedInvoices: SavedInvoiceRecord[];
  localCustomerTemplates: CustomerTemplateRecord[];
  remoteCustomerTemplates: CustomerTemplateRecord[];
};

const byUpdatedAtDesc = <T extends { updatedAt: number }>(a: T, b: T) =>
  b.updatedAt - a.updatedAt;

const toComparableJson = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

const isDeepEqual = (left: unknown, right: unknown) => {
  return toComparableJson(left) === toComparableJson(right);
};

const toDefaultChoice = (
  localUpdatedAt: number,
  cloudUpdatedAt: number
): SyncConflictChoice => {
  return localUpdatedAt >= cloudUpdatedAt ? "local" : "cloud";
};

const toInvoiceKey = (record: SavedInvoiceRecord) => {
  const invoiceNumber = record.invoiceNumber?.trim();
  if (invoiceNumber) return invoiceNumber;

  return record.id;
};

const mapInvoicesByKey = (records: SavedInvoiceRecord[]) => {
  const map = new Map<string, SavedInvoiceRecord>();

  for (const record of records) {
    const key = toInvoiceKey(record);
    const existing = map.get(key);

    if (!existing || record.updatedAt >= existing.updatedAt) {
      map.set(key, record);
    }
  }

  return map;
};

const mergeSavedInvoices = (
  localSavedInvoices: SavedInvoiceRecord[],
  remoteSavedInvoices: SavedInvoiceRecord[]
) => {
  const localMap = mapInvoicesByKey(localSavedInvoices);
  const remoteMap = mapInvoicesByKey(remoteSavedInvoices);
  const keys = new Set(
    Array.from(localMap.keys()).concat(Array.from(remoteMap.keys()))
  );

  const merged: SavedInvoiceRecord[] = [];
  const conflicts: SyncConflictRecord[] = [];

  for (const key of Array.from(keys)) {
    const local = localMap.get(key) || null;
    const remote = remoteMap.get(key) || null;

    if (!local && remote) {
      merged.push(remote);
      continue;
    }

    if (local && !remote) {
      merged.push(local);
      continue;
    }

    if (!local || !remote) {
      continue;
    }

    if (isDeepEqual(local, remote)) {
      merged.push(local.updatedAt >= remote.updatedAt ? local : remote);
      continue;
    }

    const defaultChoice = toDefaultChoice(local.updatedAt, remote.updatedAt);
    merged.push(defaultChoice === "local" ? local : remote);

    conflicts.push({
      id: `invoice:${key}`,
      entityType: "invoice",
      key,
      label: local.invoiceNumber || remote.invoiceNumber || key,
      localUpdatedAt: local.updatedAt,
      cloudUpdatedAt: remote.updatedAt,
      defaultChoice,
      localVersion: local,
      cloudVersion: remote,
    });
  }

  return {
    merged: merged.sort(byUpdatedAtDesc),
    conflicts,
  };
};

const toTemplateKey = (record: CustomerTemplateRecord) => {
  return record.id;
};

const mapTemplatesByKey = (records: CustomerTemplateRecord[]) => {
  const map = new Map<string, CustomerTemplateRecord>();

  for (const record of records) {
    const key = toTemplateKey(record);
    const existing = map.get(key);

    if (!existing || record.updatedAt >= existing.updatedAt) {
      map.set(key, record);
    }
  }

  return map;
};

const mergeCustomerTemplates = (
  localCustomerTemplates: CustomerTemplateRecord[],
  remoteCustomerTemplates: CustomerTemplateRecord[]
) => {
  const localMap = mapTemplatesByKey(localCustomerTemplates);
  const remoteMap = mapTemplatesByKey(remoteCustomerTemplates);
  const keys = new Set(
    Array.from(localMap.keys()).concat(Array.from(remoteMap.keys()))
  );

  const merged: CustomerTemplateRecord[] = [];
  const conflicts: SyncConflictRecord[] = [];

  for (const key of Array.from(keys)) {
    const local = localMap.get(key) || null;
    const remote = remoteMap.get(key) || null;

    if (!local && remote) {
      merged.push(remote);
      continue;
    }

    if (local && !remote) {
      merged.push(local);
      continue;
    }

    if (!local || !remote) {
      continue;
    }

    if (isDeepEqual(local, remote)) {
      merged.push(local.updatedAt >= remote.updatedAt ? local : remote);
      continue;
    }

    const defaultChoice = toDefaultChoice(local.updatedAt, remote.updatedAt);
    merged.push(defaultChoice === "local" ? local : remote);

    conflicts.push({
      id: `template:${key}`,
      entityType: "template",
      key,
      label: local.name || remote.name || key,
      localUpdatedAt: local.updatedAt,
      cloudUpdatedAt: remote.updatedAt,
      defaultChoice,
      localVersion: local,
      cloudVersion: remote,
    });
  }

  return {
    merged: merged.sort(byUpdatedAtDesc),
    conflicts,
  };
};

export const mergeRemoteSnapshotWithLocal = ({
  localSavedInvoices,
  remoteSavedInvoices,
  localCustomerTemplates,
  remoteCustomerTemplates,
}: MergeSnapshotArgs) => {
  const invoiceResult = mergeSavedInvoices(localSavedInvoices, remoteSavedInvoices);
  const templateResult = mergeCustomerTemplates(
    localCustomerTemplates,
    remoteCustomerTemplates
  );

  const conflicts = [...invoiceResult.conflicts, ...templateResult.conflicts];

  return {
    savedInvoices: invoiceResult.merged,
    customerTemplates: templateResult.merged,
    conflicts,
  };
};

export const toSyncConflictSummaries = (
  conflicts: SyncConflictRecord[]
): SyncConflictSummary[] => {
  return conflicts.map((conflict) => ({
    id: conflict.id,
    entityType: conflict.entityType,
    key: conflict.key,
    label: conflict.label,
    localUpdatedAt: conflict.localUpdatedAt,
    cloudUpdatedAt: conflict.cloudUpdatedAt,
    defaultChoice: conflict.defaultChoice,
  }));
};
