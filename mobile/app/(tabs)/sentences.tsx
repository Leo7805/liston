import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SentenceEditorModal } from '@/features/sentences/components/SentenceEditorModal';
import { SentenceSearchHeader } from '@/global/components/SentenceSearchHeader';
import { SentencesHeader } from '@/features/sentences/components/SentencesHeader';
import { LibrarySentences } from '@/features/sentences/components/LibrarySentences';
import { useUiStore } from '@/global/stores/ui.store';
import { useSentenceSelectionStore } from '@/features/sentences/sentenceSelection.store';
import { SentenceSelectionHeader } from '@/features/sentences/components/SentenceSelectionHeader';
import { MoveToGroupModal } from '@/features/sentences/components/MoveToGroupModal';
import { AddToPlaylistModal } from '@/features/sentences/components/AddToPlaylistModal';
import { CreateGroupModal } from '@/features/sentences/components/CreateGroupModal';
import { RenameGroupModal } from '@/features/sentences/components/RenameGroupModal';

export default function SentencesScreen() {
  const isSentenceSelecting = useSentenceSelectionStore(
    (s) => s.isSelectionMode
  );

  const isSentenceSearching = useUiStore((s) => s.isSentenceSearching);
  const { closeSentenceSearch } = useUiStore.getState();

  const showSentenceEditor = useUiStore((s) => s.showSentenceEditor);
  const showCreateGroupModal = useUiStore((s) => s.showCreateGroupModal);
  const showRenameGroupModal = useUiStore((s) => s.showRenameGroupModal);

  const { exitSelectionMode } = useSentenceSelectionStore.getState();
  const showMoveToGroupModal = useSentenceSelectionStore(
    (s) => s.showMoveToGroupModal
  );
  const showAddToPlaylistModal = useSentenceSelectionStore(
    (s) => s.showAddToPlaylistModal
  );

  // Clear search state when leaving the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear search state when leaving the screen
        closeSentenceSearch();
        exitSelectionMode();
      };
    }, [closeSentenceSearch, exitSelectionMode])
  );

  return (
    <View className="flex-1 px-3">
      {/* Header */}
      {isSentenceSelecting ? (
        <SentenceSelectionHeader />
      ) : isSentenceSearching ? (
        <SentenceSearchHeader />
      ) : (
        <SentencesHeader />
      )}

      {/* Content */}
      <View className="flex-1">
        {/*  Sentences list of current selected group*/}
        <LibrarySentences />
      </View>

      {/* Editor Modal */}
      {showSentenceEditor && <SentenceEditorModal />}

      {/* Move to Group Modal - SentenceSelectionHeader */}
      {showMoveToGroupModal && <MoveToGroupModal />}

      {/* Add to Playlist Modal - SentenceSelectionHeader */}
      {showAddToPlaylistModal && <AddToPlaylistModal />}

      {/* Create Group Modal  */}
      {showCreateGroupModal && <CreateGroupModal />}

      {/* Rename Group Modal  */}
      {showRenameGroupModal && <RenameGroupModal />}
    </View>
  );
}
