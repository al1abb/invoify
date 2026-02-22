import { CachedPdfMeta, CachedPdfRecord } from "@/types";

export const PDF_CACHE_DB_NAME = "invoify-client-cache-v1";
export const PDF_CACHE_STORE_NAME = "pdfs";
export const PDF_CACHE_MAX_ITEMS = 100;
export const PDF_CACHE_MAX_AGE_DAYS = 90;

const PDF_CACHE_DB_VERSION = 1;
const PDF_CACHE_MAX_AGE_MS =
  PDF_CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

const isSupported = () => {
  return typeof window !== "undefined" && "indexedDB" in window;
};

const requestToPromise = <T>(request: IDBRequest<T>) => {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const transactionToPromise = (tx: IDBTransaction) => {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

const openDb = () => {
  return new Promise<IDBDatabase | null>((resolve, reject) => {
    if (!isSupported()) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(PDF_CACHE_DB_NAME, PDF_CACHE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PDF_CACHE_STORE_NAME)) {
        const store = db.createObjectStore(PDF_CACHE_STORE_NAME, {
          keyPath: "invoiceNumber",
        });

        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const toMeta = (record: CachedPdfRecord): CachedPdfMeta => {
  return {
    invoiceNumber: record.invoiceNumber,
    sizeBytes: record.sizeBytes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const cleanupWithDb = async (db: IDBDatabase) => {
  const tx = db.transaction(PDF_CACHE_STORE_NAME, "readwrite");
  const store = tx.objectStore(PDF_CACHE_STORE_NAME);
  const records = (await requestToPromise(
    store.getAll()
  )) as CachedPdfRecord[];

  const now = Date.now();

  for (const record of records) {
    if (now - record.updatedAt > PDF_CACHE_MAX_AGE_MS) {
      store.delete(record.invoiceNumber);
    }
  }

  const retained = records
    .filter((record) => now - record.updatedAt <= PDF_CACHE_MAX_AGE_MS)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  if (retained.length > PDF_CACHE_MAX_ITEMS) {
    const overflow = retained.slice(PDF_CACHE_MAX_ITEMS);
    for (const record of overflow) {
      store.delete(record.invoiceNumber);
    }
  }

  await transactionToPromise(tx);
};

export const cleanupPdfCache = async () => {
  const db = await openDb();
  if (!db) return;

  try {
    await cleanupWithDb(db);
  } finally {
    db.close();
  }
};

export const upsertCachedPdf = async (
  invoiceNumber: string,
  pdfBlob: Blob
): Promise<CachedPdfRecord | null> => {
  if (!invoiceNumber.trim()) return null;

  const db = await openDb();
  if (!db) return null;

  try {
    const tx = db.transaction(PDF_CACHE_STORE_NAME, "readwrite");
    const store = tx.objectStore(PDF_CACHE_STORE_NAME);

    const existing = (await requestToPromise(
      store.get(invoiceNumber)
    )) as CachedPdfRecord | undefined;

    const now = Date.now();
    const record: CachedPdfRecord = {
      invoiceNumber,
      pdfBlob,
      mimeType: "application/pdf",
      sizeBytes: pdfBlob.size,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    store.put(record);
    await transactionToPromise(tx);
    await cleanupWithDb(db);

    return record;
  } finally {
    db.close();
  }
};

export const getCachedPdf = async (invoiceNumber: string) => {
  if (!invoiceNumber.trim()) return null;

  const db = await openDb();
  if (!db) return null;

  try {
    const tx = db.transaction(PDF_CACHE_STORE_NAME, "readonly");
    const store = tx.objectStore(PDF_CACHE_STORE_NAME);
    const record = (await requestToPromise(
      store.get(invoiceNumber)
    )) as CachedPdfRecord | undefined;

    return record || null;
  } finally {
    db.close();
  }
};

export const listCachedPdfMetadata = async (): Promise<CachedPdfMeta[]> => {
  const db = await openDb();
  if (!db) return [];

  try {
    const tx = db.transaction(PDF_CACHE_STORE_NAME, "readonly");
    const store = tx.objectStore(PDF_CACHE_STORE_NAME);
    const records = (await requestToPromise(
      store.getAll()
    )) as CachedPdfRecord[];

    return records
      .map(toMeta)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } finally {
    db.close();
  }
};

export const deleteCachedPdf = async (invoiceNumber: string) => {
  if (!invoiceNumber.trim()) return;

  const db = await openDb();
  if (!db) return;

  try {
    const tx = db.transaction(PDF_CACHE_STORE_NAME, "readwrite");
    const store = tx.objectStore(PDF_CACHE_STORE_NAME);
    store.delete(invoiceNumber);
    await transactionToPromise(tx);
  } finally {
    db.close();
  }
};

export const clearPdfCache = async () => {
  const db = await openDb();
  if (!db) return;

  try {
    const tx = db.transaction(PDF_CACHE_STORE_NAME, "readwrite");
    const store = tx.objectStore(PDF_CACHE_STORE_NAME);
    store.clear();
    await transactionToPromise(tx);
  } finally {
    db.close();
  }
};
