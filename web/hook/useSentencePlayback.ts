'use client';

import { useState } from 'react';
import { SentenceItem } from '@/types/senteces';
import { generateSpeech } from '@/services/ttsService';
import {
  pauseAudio,
  playAudio,
  resumeAudio,
  stopAudio,
  type PlaybackResult,
} from '@/services/audioPlayer';

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

export function useSentencePlayback(sentences: SentenceItem[]) {
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(
    null
  );
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  async function playSentence(sentence: SentenceItem) {
    if (playingSentenceId === sentence.id) return;
    if (isPlayingAll || isPaused) return;

    setIsPaused(false);
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
      setIsPaused(false);
    }
  }

  async function playAll() {
    if (isPlayingAll) return;
    if (playingSentenceId !== null) return;
    if (sentences.length === 0) return;

    setIsPaused(false);
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
      setIsPaused(false);
    }
  }

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
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to resume audio.'
      );
    }
  }

  async function togglePausePlayback() {
    if (isPaused) {
      await resumePlayback();
      return;
    }

    pausePlayback();
  }

  return {
    playingSentenceId,
    isPlayingAll,
    isPaused,
    errorMessage,
    playSentence,
    playAll,
    stopPlayback,
    togglePausePlayback,
  };
}
