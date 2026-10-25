'use client';

export interface QueuedAction {
  id: string;
  actionType: string;
  label: string;
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
}

export interface OfflineStoredAccount {
  id: string;
  identifier: string; // normalisé
  identifiers: string[]; // [identifiant, telephone, email] (tous normalisés)
  salt: string;
  passwordHash: string;
  userContext: {
    userId: string;
    nomComplet?: string | null;
    identifiant: string;
    telephone?: string | null;
    email?: string | null;
    role: string;
    hotelId?: string;
    hotelNom?: string;
    devise?: string;
    permissions?: any;
  };
  lastLoginAt: string;
}

const DB_NAME = 'demba_offline_dhotel';
const DB_VERSION = 2;
const STORE_QUEUE = 'pending_queue';
const STORE_SNAPSHOTS = 'snapshots';
const STORE_ACCOUNTS = 'auth_accounts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB non supporté'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        db.createObjectStore(STORE_SNAPSHOTS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
        const accStore = db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'id' });
        accStore.createIndex('identifier', 'identifier', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineAccount(account: OfflineStoredAccount): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = tx.objectStore(STORE_ACCOUNTS);
    const req = store.put(account);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function findOfflineAccount(identifierOrPhoneOrEmail: string): Promise<OfflineStoredAccount | null> {
  const db = await openDB();
  const search = identifierOrPhoneOrEmail.trim().toLowerCase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, 'readonly');
    const store = tx.objectStore(STORE_ACCOUNTS);
    const req = store.openCursor();

    req.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (!cursor) {
        resolve(null);
        return;
      }
      const acc = cursor.value as OfflineStoredAccount;
      if (
        acc.identifier === search ||
        (Array.isArray(acc.identifiers) && acc.identifiers.includes(search))
      ) {
        resolve(acc);
        return;
      }
      cursor.continue();
    };

    req.onerror = () => reject(req.error);
  });
}

export async function getOfflineAccounts(): Promise<OfflineStoredAccount[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, 'readonly');
    const store = tx.objectStore(STORE_ACCOUNTS);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function removeOfflineAccount(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, 'readwrite');
    const store = tx.objectStore(STORE_ACCOUNTS);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
