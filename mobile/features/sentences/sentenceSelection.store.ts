import { create } from 'zustand';

type SentenceSelectionState = {
  selectedSentenceIds: string[]; // List of currently selected sentence IDs
  isSelectionMode: boolean; // Whether selection mode is active

  showMoveToGroupModal: boolean; // Whether the "Move to Group" modal is visible
  showAddToPlaylistModal: boolean; // Whether the "Add to Playlist" modal is visible

  toggleSentenceSelection: (sentenceId: string) => void; // Toggle selection of a sentence
  selectSentences: (sentenceIds: string[]) => void; // Select specific sentences
  unselectSentences: (sentenceIds: string[]) => void; // Unselect specific sentences
  clearSentenceSelection: () => void; // Clear all selections
  setSelectionMode: (isSelectionMode: boolean) => void; // Manually set selection mode (optional, can be derived from selectedSentenceIds)
  enterSelectionMode: () => void; // Convenience method to enter selection mode
  exitSelectionMode: () => void; // Convenience method to exit selection mode

  openMoveToGroupModal: () => void; // Open the "Move to Group" modal
  closeMoveToGroupModal: () => void; // Close the "Move to Group" modal
  openAddToPlaylistModal: () => void; // Open the "Add to Playlist" modal
  closeAddToPlaylistModal: () => void; // Close the "Add to Playlist" modal
};

export const useSentenceSelectionStore = create<SentenceSelectionState>(
  (set) => ({
    selectedSentenceIds: [],
    isSelectionMode: false,
    showMoveToGroupModal: false,
    showAddToPlaylistModal: false,

    toggleSentenceSelection: (sentenceId: string) =>
      set((state) => {
        const isAlreadySelected =
          state.selectedSentenceIds.includes(sentenceId);
        const newSelectedIds = isAlreadySelected
          ? state.selectedSentenceIds.filter((id) => id !== sentenceId) // Unselect if already selected
          : [...state.selectedSentenceIds, sentenceId]; // Select if not already selected

        return {
          selectedSentenceIds: newSelectedIds,
          // isSelectionMode: newSelectedIds.length > 0, // Update selection mode based on whether any sentences are selected
        };
      }),

    selectSentences: (sentenceIds: string[]) =>
      set((state) => ({
        selectedSentenceIds: [
          ...new Set([...state.selectedSentenceIds, ...sentenceIds]),
        ],
        // isSelectionMode: true,
      })),

    unselectSentences: (sentenceIds: string[]) =>
      set((state) => {
        const newSelectedIds = state.selectedSentenceIds.filter(
          (id) => !sentenceIds.includes(id)
        );

        return {
          selectedSentenceIds: newSelectedIds,
          // isSelectionMode: newSelectedIds.length > 0,
        };
      }),

    clearSentenceSelection: () =>
      set({
        selectedSentenceIds: [],
        // isSelectionMode: false,
      }),

    setSelectionMode: (isSelectionMode: boolean) => set({ isSelectionMode }),

    enterSelectionMode: () => set({ isSelectionMode: true }),

    exitSelectionMode: () =>
      set({ isSelectionMode: false, selectedSentenceIds: [] }), // Optionally clear selection when exiting selection mode

    openMoveToGroupModal: () => set({ showMoveToGroupModal: true }),

    closeMoveToGroupModal: () => set({ showMoveToGroupModal: false }),

    openAddToPlaylistModal: () => set({ showAddToPlaylistModal: true }),

    closeAddToPlaylistModal: () => set({ showAddToPlaylistModal: false }),
  })
);
