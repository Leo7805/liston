import { SentenceGroupSelector } from '@/features/sentences/components/SentenceGroupSelector';
import { HeaderContainer } from '@/global/components/HeaderContainer';
import { SentenceSearchButton } from '@/global/components/SentenceSearchButton';
import { AddSentenceButton } from '@/features/sentences/components/AddSentenceButton';
import { useUiStore } from '@/global/stores/ui.store';
import { SentenceOverflowMenu } from './SentenceOverflowMenu';

/**
 * Header bar of sentences page
 */

export function SentencesHeader() {
  const { setIsSentenceSearching } = useUiStore.getState();

  return (
    <HeaderContainer>
      {/* Group selection dropdown  */}
      <SentenceGroupSelector />

      {/* Search bar */}
      <SentenceSearchButton onPress={() => setIsSentenceSearching(true)} />

      {/* Open Sentence Editor Button */}
      <AddSentenceButton />

      {/* Sentence item overflow menu */}
      <SentenceOverflowMenu />
    </HeaderContainer>
  );
}
