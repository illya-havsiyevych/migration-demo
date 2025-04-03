import { StorageInterface, MemoryItem } from '@/types/storage';

// Browser storage implementation
export class BrowserStorage implements StorageInterface {
  private readonly prefix: string;

  constructor(prefix: string = 'dial_chat_') {
    this.prefix = prefix;
  }

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);

      if (item === null) {
        return defaultValue ?? null;
      }

      const parsedItem: MemoryItem<T> = JSON.parse(item);
      const { value, expiry } = parsedItem;

      if (expiry && Date.now() > expiry) {
        await this.removeItem(key);
        return defaultValue ?? null;
      }

      return value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return defaultValue ?? null;
    }
  }

  async setItem<T>(key: string, value: T, expiryTime?: number): Promise<void> {
    try {
      const item: MemoryItem<T> = {
        value,
        ...(expiryTime && { expiry: Date.now() + expiryTime }),
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

// Create a default browser storage instance
export const browserStorage = new BrowserStorage();

// Memory storage implementation (for temporary data)
export class MemoryStorage implements StorageInterface {
  private storage: Map<string, MemoryItem<any>>;

  constructor() {
    this.storage = new Map();
  }

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    const item = this.storage.get(key);

    if (!item) {
      return defaultValue ?? null;
    }

    const { value, expiry } = item;

    if (expiry && Date.now() > expiry) {
      await this.removeItem(key);
      return defaultValue ?? null;
    }

    return value;
  }

  async setItem<T>(key: string, value: T, expiryTime?: number): Promise<void> {
    const item: MemoryItem<T> = {
      value,
      ...(expiryTime && { expiry: Date.now() + expiryTime }),
    };

    this.storage.set(key, item);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

// Create a default memory storage instance
export const memoryStorage = new MemoryStorage();
