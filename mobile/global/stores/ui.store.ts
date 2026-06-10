import { create } from 'zustand';

export type UIState = {
  showSentenceEditor: boolean;
  showCreateGroupModal: boolean;
  showRenameGroupModal: boolean;
  showCreatePlaylistModal: boolean;
  showRenamePlaylistModal: boolean;
  editingSentenceId: string | null; // The sentence currently being edited (null if adding new)
  showFullPlayer: boolean;
  isSentenceSearching: boolean;
  sentenceSearchText: string;

  error: string | null;
  showError: (message: string) => void; // Function to set an error message
  clearError: () => void; // Function to clear the current error message

  openSentenceEditor: () => void;
  closeSentenceEditor: () => void;
  openCreateGroupModal: () => void;
  closeCreateGroupModal: () => void;
  openRenameGroupModal: () => void;
  closeRenameGroupModal: () => void;
  openCreatePlaylistModal: () => void;
  closeCreatePlaylistModal: () => void;
  openRenamePlaylistModal: () => void;
  closeRenamePlaylistModal: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;

  setEditingSentenceId: (sentenceId: string | null) => void; // Set the sentence being edited (or null for adding new)

  setIsSentenceSearching: (isSentenceSearching: boolean) => void; // Set the sentence searching state
  setSentenceSearchText: (keyword: string) => void; // Set the current sentence search keyword
  closeSentenceSearch: () => void; // Helper to close sentence search and clear keyword
};

export const useUiStore = create<UIState>((set) => ({
  showSentenceEditor: false,
  showCreateGroupModal: false,
  showRenameGroupModal: false,
  showCreatePlaylistModal: false,
  showRenamePlaylistModal: false,
  editingSentenceId: null,
  showFullPlayer: false,
  isSentenceSearching: false,
  sentenceSearchText: '',
  error: null,

  openSentenceEditor: () => set({ showSentenceEditor: true }),
  closeSentenceEditor: () => set({ showSentenceEditor: false }),
  openCreateGroupModal: () => set({ showCreateGroupModal: true }),
  closeCreateGroupModal: () => set({ showCreateGroupModal: false }),
  openRenameGroupModal: () => set({ showRenameGroupModal: true }),
  closeRenameGroupModal: () => set({ showRenameGroupModal: false }),
  openCreatePlaylistModal: () => set({ showCreatePlaylistModal: true }),
  closeCreatePlaylistModal: () => set({ showCreatePlaylistModal: false }),
  openRenamePlaylistModal: () => set({ showRenamePlaylistModal: true }),
  closeRenamePlaylistModal: () => set({ showRenamePlaylistModal: false }),
  openFullPlayer: () => set({ showFullPlayer: true }),
  closeFullPlayer: () => set({ showFullPlayer: false }),

  setEditingSentenceId: (sentenceId) =>
    set({ editingSentenceId: sentenceId || null }),

  showError: (message: string) => set({ error: message }),
  clearError: () => set({ error: null }),

  setIsSentenceSearching: (isSentenceSearching: boolean) =>
    set({ isSentenceSearching }),
  setSentenceSearchText: (keyword: string) =>
    set({ sentenceSearchText: keyword }),
  closeSentenceSearch: () =>
    set({ isSentenceSearching: false, sentenceSearchText: '' }),
}));
