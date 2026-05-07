'use client';

// App entry page. Connects sentence storage, playback logic, and UI components.

import { useIsHydrated } from '@/hook/useIsHydrated';
import { useStoredSentences } from '@/hook/useStoredSentences';
import { useSentencePlayback } from '@/hook/useSentencePlayback';
import { SentenceForm } from '@/components/sentence-form';
import { SentenceList } from '@/components/sentence-list';
import { AppLogo } from '@/components/app-logo';

export default function HomePage() {
  const isHydrated = useIsHydrated();
  const sentenceStore = useStoredSentences(); // Manage sentence data with localStorage persistence
  const playback = useSentencePlayback(sentenceStore.sentences);

  return (
    <main className="min-h-screen px-6 pt-6 pb-[95vh]">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* app header: logo, title, playback error messages */}
        <header>
          <div className="flex items-center gap-3">
            <AppLogo />
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Liston</h1>
            </div>
          </div>
          {playback.status.errorMessage && (
            <p className="text-sm text-destructive">
              {playback.status.errorMessage}
            </p>
          )}
        </header>

        {/* Adding sentence form */}
        <SentenceForm
          onAddSentence={sentenceStore.addSentence}
          disabled={playback.status.isPlayingAll}
        />

        {/* Sentences list */}
        <SentenceList
          sentenceStore={sentenceStore}
          isHydrated={isHydrated}
          playback={playback}
        />
      </div>
    </main>
  );
}
