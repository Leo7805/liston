'use client';

import { useIsHydrated } from '@/hook/useIsHydrated';
import { useStoredSentences } from '@/hook/useStoredSentences';
import { useSentencePlayback } from '@/hook/useSentencePlayback';
import { SentenceForm } from '@/components/sentence-form';
import { SentenceList } from '@/components/sentence-list';
import { AppLogo } from '@/components/app-logo';
import { useState } from 'react';
import type { PlaybackMode } from '@/types/senteces';

export default function HomePage() {
  const isHydrated = useIsHydrated(); // Detect hydration status to prevent SSR/client mismatch
  const { sentences, addSentence, deleteSentence } = useStoredSentences();
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequential'); // state to control playback mode
  const [loopPlayback, setLoopPlayback] = useState(false); // state to control loop playback
  const {
    playingSentenceId,
    isPlayingAll,
    isPaused,
    errorMessage,
    playSentence,
    playAll,
    stopPlayback,
    togglePausePlayback,
  } = useSentencePlayback(sentences, playbackMode, loopPlayback);

  function handleDeleteSentence(id: string) {
    deleteSentence(id);
  }

  return (
    <main className="min-h-screen px-6 pt-6 pb-[95vh]">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <div className="flex items-center gap-3">
            <AppLogo />
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Liston</h1>
              {/* <p className="mt-1 text-sm text-muted-foreground">
                Listen. Repeat. Remember.
              </p> */}
            </div>
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </header>

        {/* add sentence form */}
        <SentenceForm onAddSentence={addSentence} disabled={isPlayingAll} />

        {/* sentences list */}
        <SentenceList
          sentences={sentences}
          isHydrated={isHydrated}
          isPlayingAll={isPlayingAll}
          isPaused={isPaused}
          playingSentenceId={playingSentenceId}
          playbackMode={playbackMode}
          loopPlayback={loopPlayback}
          onPlaybackModeChange={setPlaybackMode}
          onLoopPlaybackChange={setLoopPlayback}
          onPlayAll={playAll}
          onPlaySentence={playSentence}
          onStopPlayback={stopPlayback}
          onTogglePausePlayback={togglePausePlayback}
          onDeleteSentence={handleDeleteSentence}
        />
      </div>
    </main>
  );
}
