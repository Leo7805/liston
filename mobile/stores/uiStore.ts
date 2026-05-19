import { create } from 'zustand';
import { SentenceItem } from '@/types/sentences';

export type UIState = {
  showSentenceEditor: boolean;
  editingSentence: SentenceItem | null; // The sentence currently being edited (null if adding new)
  showFullPlayer: boolean;

  openSentenceEditor: () => void;
  closeSentenceEditor: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;

  setEditingSentence: (sentence: SentenceItem | null) => void; // Set the sentence being edited (or null for adding new)
};

export const useUiStore = create<UIState>((set) => ({
  showSentenceEditor: false,
  editingSentence: null,
  showFullPlayer: false,

  openSentenceEditor: () => set({ showSentenceEditor: true }),
  closeSentenceEditor: () => set({ showSentenceEditor: false }),
  openFullPlayer: () => set({ showFullPlayer: true }),
  closeFullPlayer: () => set({ showFullPlayer: false }),

  setEditingSentence: (sentence) => set({ editingSentence: sentence }),
}));
