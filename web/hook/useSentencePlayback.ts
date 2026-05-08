'use client';

// Manages playback UI state, settings, and user actions.

import { useState, useEffect, useRef } from 'react';
import { pauseAudio, resumeAudio, stopAudio } from '@/services/audioPlayer';
import type { SentenceItem, PlaybackMode } from '@/types/sentences';
import {
  createPlaybackFlowController,
  type PlaybackFlowController,
} from '@/services/playbackFlowController';
import {
  runPlaybackSession,
  type PlaybackPartOrder,
} from '@/services/playbackSession';

// Type for managing a playback session's flow and abort control
type PlaybackSessionControl = {
  flowController: PlaybackFlowController;
  abortController: AbortController;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

// Main hook to manage sentence playback
export function useSentencePlayback(sentences: SentenceItem[]) {
  // Playback settings
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequential');
  const [loopPlayback, setLoopPlayback] = useState(false);
  const [partOrder, setPartOrder] =
    useState<PlaybackPartOrder>('original_first');

  // Playback runtime state
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(
    null
  );
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs used by async playback flows.
  const playbackModeRef = useRef(playbackMode);
  const loopPlaybackRef = useRef(loopPlayback);
  const partOrderRef = useRef(partOrder);
  const sessionControlRef = useRef<PlaybackSessionControl | null>(null);

  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  useEffect(() => {
    loopPlaybackRef.current = loopPlayback;
  }, [loopPlayback]);

  useEffect(() => {
    partOrderRef.current = partOrder;
  }, [partOrder]);

  // Playback session control lifecycle
  function startSessionControl(): PlaybackSessionControl {
    const flowController = createPlaybackFlowController();
    const abortController = new AbortController();
    const sessionControl = { flowController, abortController };
    sessionControlRef.current = sessionControl;
    return sessionControl;
  }

  function clearSessionControl(sessionControl: PlaybackSessionControl) {
    if (sessionControlRef.current === sessionControl) {
      sessionControlRef.current = null;
    }
  }

  function stopCurrentSession() {
    const sessionControl = sessionControlRef.current;
    if (sessionControl) {
      sessionControl.flowController.stop();
      sessionControl.abortController.abort();
    }
    stopAudio();
  }

  function handlePlaybackError(error: unknown) {
    if (isAbortError(error)) return;
    setErrorMessage(getErrorMessage(error, 'Failed to play audio.'));
  }

  // Playback actions
  async function playSentence(sentence: SentenceItem) {
    if (playingSentenceId === sentence.id) return; // Already playing this sentence
    if (isPlayingAll || isPaused) return; // Defensive check - playSentence mode should be disabled in these states

    const sessionControl = startSessionControl();

    setIsPaused(false);
    setErrorMessage(null);
    setPlayingSentenceId(sentence.id);

    try {
      await runPlaybackSession({
        sentences: [sentence],
        getPlaybackMode: () => playbackModeRef.current,
        getLoopPlayback: () => loopPlaybackRef.current,
        getPartOrder: () => partOrderRef.current,
        flowController: sessionControl.flowController,
        onPlayingSentenceIdChange: setPlayingSentenceId,
        abortSignal: sessionControl.abortController.signal,
      });
    } catch (error) {
      handlePlaybackError(error);
    } finally {
      if (sessionControlRef.current === sessionControl) {
        setPlayingSentenceId((currentId) =>
          currentId === sentence.id ? null : currentId
        );
        setIsPaused(false);
      }

      clearSessionControl(sessionControl);
    }
  }

  async function startPlaybackSession(startSentenceId?: string) {
    const sessionControl = startSessionControl();

    setIsPaused(false);
    setErrorMessage(null);
    setIsPlayingAll(true);

    try {
      await runPlaybackSession({
        sentences,
        getPlaybackMode: () => playbackModeRef.current,
        getLoopPlayback: () => loopPlaybackRef.current,
        getPartOrder: () => partOrderRef.current,
        flowController: sessionControl.flowController,
        startSentenceId,
        onPlayingSentenceIdChange: setPlayingSentenceId,
        abortSignal: sessionControl.abortController.signal,
      });
    } catch (error) {
      handlePlaybackError(error);
    } finally {
      if (sessionControlRef.current === sessionControl) {
        setPlayingSentenceId(null);
        setIsPaused(false);
        setIsPlayingAll(false);
      }
      clearSessionControl(sessionControl);
    }
  }

  async function playAll() {
    if (isPlayingAll) return;
    if (playingSentenceId != null) return;
    if (sentences.length === 0) return;

    await startPlaybackSession();
  }

  // Restart the active queue session from a specific sentence.
  async function playFromSentence(sentenceId: string) {
    if (sentences.length === 0) return;
    if (!isPlayingAll) return;

    stopCurrentSession();

    await startPlaybackSession(sentenceId);
  }

  // Control actions
  function stopPlayback() {
    stopCurrentSession();
    setPlayingSentenceId(null);
    setIsPlayingAll(false);
    setIsPaused(false);
  }

  function pausePlayback() {
    sessionControlRef.current?.flowController.pause();
    pauseAudio();
    setIsPaused(true);
  }

  async function resumePlayback() {
    try {
      sessionControlRef.current?.flowController.resume();
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

  // Public API for components
  return {
    settings: {
      playbackMode,
      loopPlayback,
      partOrder,
      setPlaybackMode,
      setLoopPlayback,
      setPartOrder,
    },
    status: {
      playingSentenceId,
      isPlayingAll,
      isPaused,
      errorMessage,
    },
    actions: {
      playSentence,
      playFromSentence,
      playAll,
      stopPlayback,
      togglePausePlayback,
    },
  };
}

export type SentencePlayback = ReturnType<typeof useSentencePlayback>;
