import { create } from 'zustand';

type PlaylistItemSelectionState = {
  selectedPlaylistItemIds: string[]; // List of currently selected playlist item IDs
  isSelectionMode: boolean; // Whether selection mode is active
  isDeleteItemMode: boolean; // Whether delete item mode is active (a special mode for deleting items from a playlist)
  isMoveItemMode: boolean; // Whether move item mode is active (a special mode for moving items between playlists)

  togglePlaylistItemSelection: (itemId: string) => void; // Toggle selection of a playlist item
  selectPlaylistItems: (itemIds: string[]) => void; // Select specific playlist items
  unselectPlaylistItems: (itemIds: string[]) => void; // Unselect specific playlist items
  clearPlaylistItemSelection: () => void; // Clear all selections
  setSelectionMode: (isSelectionMode: boolean) => void; // Manually set selection mode (optional, can be derived from selectedPlaylistItemIds)
  enterSelectionMode: () => void; // Convenience method to enter selection mode
  exitSelectionMode: () => void; // Convenience method to exit selection mode

  /* Special Modes for Playlist Item Actions: These modes are activated when the user initiates specific actions from a playlist, such as deleting items or moving items between playlists. */
  startDeleteItemMode: () => void; // Start the delete item mode
  clearDeleteItemMode: () => void; // Clear the delete item mode (can be called when exiting selection mode or after completing delete actions)
  startMoveItemMode: () => void; // Start the move item mode
  clearMoveItemMode: () => void; // Clear the move item mode (can be called when exiting selection mode or after completing move actions)
};

export const usePlaylistItemSelectionStore = create<PlaylistItemSelectionState>(
  (set) => ({
    selectedPlaylistItemIds: [],
    isSelectionMode: false,
    isDeleteItemMode: false,
    isMoveItemMode: false,

    togglePlaylistItemSelection: (itemId: string) =>
      set((state) => {
        const isAlreadySelected =
          state.selectedPlaylistItemIds.includes(itemId);
        const newSelectedIds = isAlreadySelected
          ? state.selectedPlaylistItemIds.filter((id) => id !== itemId) // Unselect if already selected
          : [...state.selectedPlaylistItemIds, itemId]; // Select if not already selected

        return {
          selectedPlaylistItemIds: newSelectedIds,
          // isSelectionMode: newSelectedIds.length > 0, // Update selection mode based on whether any items are selected
        };
      }),

    selectPlaylistItems: (itemIds: string[]) =>
      set((state) => ({
        selectedPlaylistItemIds: [
          ...new Set([...state.selectedPlaylistItemIds, ...itemIds]),
        ],
        // isSelectionMode: true,
      })),

    unselectPlaylistItems: (itemIds: string[]) =>
      set((state) => ({
        selectedPlaylistItemIds: state.selectedPlaylistItemIds.filter(
          (id) => !itemIds.includes(id)
        ),
        // isSelectionMode: state.selectedPlaylistItemIds.length > itemIds.length, // Update selection mode based on whether any items are still selected after unselecting
      })),

    clearPlaylistItemSelection: () =>
      set({
        selectedPlaylistItemIds: [],
        // isSelectionMode: false,
        // isDeleteItemMode: false,
        // isMoveItemMode: false,
      }),

    setSelectionMode: (isSelectionMode: boolean) => set({ isSelectionMode }),

    enterSelectionMode: () => set({ isSelectionMode: true }),

    exitSelectionMode: () =>
      set({
        isSelectionMode: false,
        selectedPlaylistItemIds: [],
        isDeleteItemMode: false,
        isMoveItemMode: false,
      }),

    startDeleteItemMode: () =>
      set({
        isSelectionMode: true,
        isDeleteItemMode: true,
        isMoveItemMode: false,
      }),

    clearDeleteItemMode: () =>
      set({ isSelectionMode: false, isDeleteItemMode: false }),

    startMoveItemMode: () =>
      set({
        isSelectionMode: true,
        isMoveItemMode: true,
        isDeleteItemMode: false,
      }),

    clearMoveItemMode: () =>
      set({ isSelectionMode: false, isMoveItemMode: false }),
  })
);
