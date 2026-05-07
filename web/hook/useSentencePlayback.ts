'use client';

// Manages sentence playback state, playback settings, and playback actions.

import { useState, useEffect, useRef } from 'react';
import { generateSpeech } from '@/services/ttsService';
import {
  pauseAudio,
  playAudio,
  resumeAudio,
  stopAudio,
  type PlaybackResult,
} from '@/services/audioPlayer';
import type { SentenceItem, PlaybackMode } from '@/types/sentences';
import { createPlaybackQueue } from '@/services/playbackScheduler';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// Plays English audio first, then Chinese audio.
async function playSentenceAudio(
  sentence: SentenceItem
): Promise<PlaybackResult> {
  if (!sentence.en.trim() && !sentence.zh.trim()) {
    throw new Error(
      'Both English sentence and Chinese translation cannot be empty.'
    );
  }

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

// Main hook to manage sentence playback
export function useSentencePlayback(sentences: SentenceItem[]) {
  // Playback settings
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequential');
  const [loopPlayback, setLoopPlayback] = useState(false);

  // Playback runtime state
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(
    null
  );
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep the latest settings available inside the async playAll loop.
  const playbackModeRef = useRef(playbackMode);
  const loopPlaybackRef = useRef(loopPlayback);

  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  useEffect(() => {
    loopPlaybackRef.current = loopPlayback;
  }, [loopPlayback]);

  // Single sentence playback
  async function playSentence(sentence: SentenceItem) {
    if (playingSentenceId === sentence.id) return;
    if (isPlayingAll || isPaused) return;

    setIsPaused(false);
    setErrorMessage(null);
    setPlayingSentenceId(sentence.id);

    try {
      await playSentenceAudio(sentence);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to play audio.'));
    } finally {
      setPlayingSentenceId((currentId) =>
        currentId === sentence.id ? null : currentId
      );
      setIsPaused(false);
    }
  }

  // Full list playback
  async function playAll() {
    if (isPlayingAll) return;
    if (playingSentenceId !== null) return;
    if (sentences.length === 0) return;

    setIsPaused(false);
    setErrorMessage(null);
    setIsPlayingAll(true);

    try {
      let shouldContinue = true;

      while (shouldContinue) {
        const playbackQueue = createPlaybackQueue(
          sentences,
          playbackModeRef.current
        );

        for (const sentence of playbackQueue) {
          if (!sentence.en.trim() && !sentence.zh.trim()) {
            continue; // skip empty sentences
          }
          setPlayingSentenceId(sentence.id);
          const result = await playSentenceAudio(sentence);

          if (result !== 'ended') {
            shouldContinue = false;
            break;
          }
        }

        if (!loopPlaybackRef.current) {
          shouldContinue = false;
        }
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to play audio.'));
    } finally {
      setPlayingSentenceId(null);
      setIsPlayingAll(false);
      setIsPaused(false);
    }
  }

  // Playback controls
  function stopPlayback() {
    stopAudio();
    setPlayingSentenceId(null);
    setIsPlayingAll(false);
    setIsPaused(false);
  }

  function pausePlayback() {
    pauseAudio();
    setIsPaused(true);
  }

  async function resumePlayback() {
    try {
      await resumeAudio();
      setIsPaused(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to resume audio.'));
    }
  }

  async function togglePausePlayback() {
    if (isPaused) {
      await resumePlayback();
      return;
    }

    pausePlayback();
  }

  // Public API for the components
  return {
    settings: {
      playbackMode,
      loopPlayback,
      setPlaybackMode,
      setLoopPlayback,
    },
    status: {
      playingSentenceId,
      isPlayingAll,
      isPaused,
      errorMessage,
    },
    actions: {
      playSentence,
      playAll,
      stopPlayback,
      togglePausePlayback,
    },
  };
}

export type SentencePlayback = ReturnType<typeof useSentencePlayback>;
