const isBrowser = () => typeof window !== "undefined";

export const safeReadLocalStorage = (key: string) => {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeWriteLocalStorage = (key: string, value: string) => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const safeRemoveLocalStorage = (key: string) => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const backupCorruptedLocalStorage = (
  sourceKey: string,
  namespace: string,
  rawValue: string
) => {
  const backupKey = `invoify:backup:${namespace}:${Date.now()}`;
  safeWriteLocalStorage(backupKey, rawValue);
  safeRemoveLocalStorage(sourceKey);
  return backupKey;
};

export const safeParseJson = (raw: string): { ok: true; data: unknown } | { ok: false } => {
  try {
    return {
      ok: true,
      data: JSON.parse(raw),
    };
  } catch {
    return {
      ok: false,
    };
  }
};
