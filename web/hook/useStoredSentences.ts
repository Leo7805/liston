'use client';

// Manages saved sentences with localStorage persistence.

import { useState, useEffect } from 'react';
import type { SentenceItem } from '@/types/sentences';
import { useIsHydrated } from './useIsHydrated';

const SENTENCES_STORAGE_KEY = 'listen-loop-sentences';

function parseStoredSentences(value: string): SentenceItem[] {
  return JSON.parse(value) as SentenceItem[];
}

export function useStoredSentences() {
  const isHydrated = useIsHydrated();
  const [sentences, setSentences] = useState<SentenceItem[]>([]);

  // Load sentences from localStorage on mount.
  useEffect(() => {
    const stored = localStorage.getItem(SENTENCES_STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = parseStoredSentences(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSentences(parsed);
    } catch {
      localStorage.removeItem(SENTENCES_STORAGE_KEY);
    }
  }, []);

  // Save sentences to localStorage whenever they change.
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(sentences));
  }, [sentences, isHydrated]);

  // Sentence actions
  function addSentence(en: string, zh: string) {
    const newSentence: SentenceItem = {
      id: crypto.randomUUID(),
      en: en.trim(),
      zh: zh.trim(),
    };

    setSentences((prev) => [...prev, newSentence]);
  }

  function deleteSentence(id: string) {
    setSentences((prev) => prev.filter((sentence) => sentence.id !== id));
  }

  return {
    sentences,
    addSentence,
    deleteSentence,
  };
}

export type SentenceStore = ReturnType<typeof useStoredSentences>;
