'use client';

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

// IndexedDB wrapper for caching generated speech audio blobs.
// The module lazily initializes the database connection to avoid issues during
// Next.js server-side rendering

const DB_NAME = 'SpeechAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

// Define the structure of the records stored in IndexedDB for speech audio.
type SpeechRecord = {
  key: string;
  audioBlob: Blob;
  createdAt: number;
};

// Define the schema for IndexedDB using idb's DBSchema interface.
interface SpeechDB extends DBSchema {
  audioFiles: {
    key: string;
    value: SpeechRecord;
  };
}

// Type alias for the promise that resolves to the IndexedDB database instance.
type DbPromiseType = Promise<IDBPDatabase<SpeechDB>>;

// Module-level variable to hold the promise for the database connection.
let dbPromise: DbPromiseType | undefined;

/**
 * Lazily open IndexedDB so module evaluation remains safe during Next.js prerendering.
 * @returns A promise resolving to the IndexedDB database instance.
 */
function getDB(): DbPromiseType {
  // Check if IndexedDB is available in the current environment (e.g., it may be undefined during SSR).
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment.');
  }

  // If the database connection has already been initiated, return the existing promise.
  // Otherwise, open the database and store the promise for future calls.
  dbPromise ??= openDB<SpeechDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    },
  });

  return dbPromise;
}

// Get the cached speech audio from IndexedDB using the provided key. If a record exists, return its audioBlob; otherwise, return undefined.
export async function getSpeechFromIndexedDB(
  key: string
): Promise<Blob | undefined> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, key);

  return record?.audioBlob;
}

// Store the generated speech audio in IndexedDB under the specified key.
export async function setSpeechToIndexedDB(
  key: string,
  audioBlob: Blob
): Promise<void> {
  const db = await getDB();

  const record: SpeechRecord = {
    key,
    audioBlob,
    createdAt: Date.now(),
  };

  await db.put(STORE_NAME, record);
}

export async function deleteSpeechFromIndexedDB(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}

export async function clearSpeechIndexedDB(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function getSpeechIndexedDBSize(): Promise<number> {
  const db = await getDB();
  return await db.count(STORE_NAME);
}
