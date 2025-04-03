export enum StorageType {
  BrowserStorage = 'BROWSER_STORAGE',
  API = 'API',
}

export interface StorageInterface {
  getItem<T>(key: string, defaultValue?: T): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface MemoryItem<T> {
  value: T;
  expiry?: number;
}
