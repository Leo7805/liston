'use client';

import { useState, useEffect } from 'react';
import type { SentenceItem } from '@/types/senteces';
import { useIsHydrated } from './useIsHydrated';

const SENTENCES_STORAGE_KEY = 'listen-loop-sentences';

export function useStoredSentences() {
  const isHydrated = useIsHydrated(); // Detect hydration status to prevent SSR/client mismatch
  const [sentences, setSentences] = useState<SentenceItem[]>([]);

  // Load sentences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SENTENCES_STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as SentenceItem[];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSentences(parsed);
    } catch {
      localStorage.removeItem(SENTENCES_STORAGE_KEY);
    }
  }, []);

  // Save sentences to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(sentences));
  }, [sentences, isHydrated]);

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
