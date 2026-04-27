'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateSpeech } from '@/services/ttsService';
import { playAudio, type PlaybackResult } from '@/services/audioPlayer';
import { Volume2, Trash2 } from 'lucide-react';
import { useSyncExternalStore } from 'react';

type SentenceItem = {
  id: string;
  en: string;
  zh: string;
};

const SENTENCES_STORAGE_KEY = 'listen-loop-sentences';

// Hook to detect whether the component has hydrated on the client
function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {}, // No subscription needed
    () => true, // Client snapshot (after hydration)
    () => false // Server snapshot and initial client render
  );
}

export default function HomePage() {
  const isHydrated = useIsHydrated();

  const [enSentence, setEnSentence] = useState('');
  const [zhTranslation, setZhTranslation] = useState('');
  const [sentences, setSentences] = useState<SentenceItem[]>(() => {
    if (typeof window === 'undefined') return []; // Guard against SSR, as localStorage is not available on the server

    // Load sentences from localStorage on mount
    const stored = localStorage.getItem(SENTENCES_STORAGE_KEY);

    if (!stored) return [];

    try {
      return JSON.parse(stored) as SentenceItem[];
    } catch {
      localStorage.removeItem(SENTENCES_STORAGE_KEY);
      return [];
    }
  });
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(
    null
  );
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save sentences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(sentences));
  }, [sentences]);

  function handleAddSentence() {
    const newSentence: SentenceItem = {
      id: crypto.randomUUID(),
      en: enSentence.trim(),
      zh: zhTranslation.trim(),
    };

    setSentences((prev) => [...prev, newSentence]);
    setEnSentence('');
    setZhTranslation('');
  }

  function handleDeleteSentence(id: string) {
    setSentences((prev) => prev.filter((sentence) => sentence.id !== id));
  }

  async function playSentenceAudio(
    sentence: SentenceItem
  ): Promise<PlaybackResult> {
    if (!sentence.en.trim() && !sentence.zh.trim())
      throw new Error(
        'Both English sentence and Chinese translation cannot be empty.'
      );

    if (sentence.en.trim()) {
      const enBlob = await generateSpeech(sentence.en, 'en');
      const enResult = await playAudio(enBlob);
      if (enResult !== 'ended') {
        return enResult;
      }
    }

    if (sentence.zh.trim()) {
      const zhBlob = await generateSpeech(sentence.zh, 'zh');
      const zhResult = await playAudio(zhBlob);
      if (zhResult !== 'ended') {
        return zhResult;
      }
    }

    return 'ended';
  }

  async function handlePlaySentence(sentence: SentenceItem) {
    if (playingSentenceId === sentence.id) return;
    if (isPlayingAll) return;

    setErrorMessage(null);
    setPlayingSentenceId(sentence.id);

    try {
      await playSentenceAudio(sentence);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to play audio.'
      );
    } finally {
      setPlayingSentenceId((currentId) =>
        currentId === sentence.id ? null : currentId
      );
    }
  }

  async function handlePlayAll() {
    if (isPlayingAll) return;
    if (playingSentenceId !== null) return;
    if (sentences.length === 0) return;
    setErrorMessage(null);
    setIsPlayingAll(true);

    try {
      for (const sentence of sentences) {
        if (!sentence.en.trim() && !sentence.zh.trim()) {
          continue; // skip sentences with both English and Chinese empty
        }
        setPlayingSentenceId(sentence.id);
        const result = await playSentenceAudio(sentence);

        if (result !== 'ended') {
          break;
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to play audio.'
      );
    } finally {
      setPlayingSentenceId(null);
      setIsPlayingAll(false);
    }
  }

  return (
    <main className="min-h-screen px-6 pt-6 pb-[95vh]">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">ListenLoop</h1>
          <p className="mt-2 text-muted-foreground">
            AI-assisted English listening trainer.
          </p>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </header>

        {/* add sentence form */}
        <section className="rounded-lg border p-4">
          <div>
            <h2 className="text-lg font-semibold">Add sentence</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an English sentence and its Chinese translation.
            </p>
          </div>

          {/* input form */}
          <div className="space-y-3">
            <Textarea
              placeholder="English sentence"
              value={enSentence}
              onChange={(e) => setEnSentence(e.target.value)}
            />
            <Textarea
              placeholder="Chinese translation"
              value={zhTranslation}
              onChange={(e) => setZhTranslation(e.target.value)}
            />
            <Button
              className="cursor-pointer transition-colors hover:bg-primary/90"
              onClick={handleAddSentence}
              disabled={!enSentence.trim()}
            >
              Add sentence
            </Button>
          </div>
        </section>

        {/* sentences list */}
        <section className="rounded-lg border p4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sentences</h2>
            {/* play all button */}
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handlePlayAll}
              disabled={
                !isHydrated || // Prevent mismatch before hydration
                sentences.length === 0 ||
                isPlayingAll ||
                playingSentenceId !== null
              }
            >
              {isPlayingAll || playingSentenceId !== null
                ? 'Playing...'
                : 'Play all'}
            </Button>
          </div>
          {sentences.length === 0 || !isHydrated ? (
            <p className="mt-1 text-sm text-muted-foreground">
              No sentences yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {sentences.map((sentence, index) => (
                // sentence
                <div key={sentence.id} className="py-1">
                  <div className="flex items-start gap-3">
                    {/* play button */}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-blue-500"
                      onClick={() => handlePlaySentence(sentence)}
                      aria-label="Play sentence"
                    >
                      <Volume2
                        className={
                          playingSentenceId === sentence.id
                            ? 'animate-pulse text-emerald-500'
                            : ''
                        }
                      />
                    </Button>
                    <div className="min-w-0 flex-1">
                      <div className="grid grid-cols-[2rem_1fr] gap-x-2 leading-5">
                        <span className="text-sm text-muted-foreground">
                          {index + 1}.
                        </span>

                        <p className="min-w-0">
                          <span className="font-medium">{sentence.en}</span>
                          <span className="ml-3 text-sm text-muted-foreground">
                            {sentence.zh}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* delete button */}
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-destructive"
                      disabled={
                        playingSentenceId === sentence.id || isPlayingAll
                      }
                      onClick={() => handleDeleteSentence(sentence.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
