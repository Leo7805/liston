// Runs a complete playback session: queue, sentence parts, TTS, and audio playback.

import {
  playAudio,
  AudioPlaybackResult,
  type AudioPlaybackResultType,
} from '@/services/audioPlayer';
import {
  PlaybackFlowState,
  type PlaybackFlowController,
} from '@/services/playbackFlowController';
import { LanguageCode, type LanguageCodeType } from '@/types/languages';
import type { PlaybackMode, SentenceItem } from '@/types/sentences';
import { createPlaybackQueue } from '@/services/playbackScheduler';
import { getSpeechAudio } from '@/services/speechAudioService';

export type PlaybackPartRole = 'original' | 'translation';

export type PlaybackPartOrder =
  | 'original_first'
  | 'translation_first'
  | 'original_only'
  | 'translation_only';

type PlaybackPart = {
  role: PlaybackPartRole;
  text: string;
  lang: LanguageCodeType;
};

export type PlaybackSessionOptions = {
  sentences: SentenceItem[];
  getPlaybackMode: () => PlaybackMode;
  getLoopPlayback: () => boolean;
  getPartOrder: () => PlaybackPartOrder;
  flowController: PlaybackFlowController;
  abortSignal?: AbortSignal;
  startSentenceId?: string;
  onPlayingSentenceIdChange: (sentenceId: string | null) => void;
};

function createPlaybackParts(
  sentence: SentenceItem,
  partOrder: PlaybackPartOrder
): PlaybackPart[] {
  const originalPart: PlaybackPart = {
    role: 'original',
    text: sentence.en,
    lang: LanguageCode.English,
  };

  const translationPart: PlaybackPart = {
    role: 'translation',
    text: sentence.zh,
    lang: LanguageCode.Chinese,
  };

  const partsByOrder: Record<PlaybackPartOrder, PlaybackPart[]> = {
    original_first: [originalPart, translationPart],
    translation_first: [translationPart, originalPart],
    original_only: [originalPart],
    translation_only: [translationPart],
  };

  return partsByOrder[partOrder].filter((part) => part.text.trim());
}

// Plays each configured sentence part in order.
async function playSentenceParts(
  sentence: SentenceItem,
  partOrder: PlaybackPartOrder,
  flowController: PlaybackFlowController,
  abortSignal?: AbortSignal
): Promise<AudioPlaybackResultType> {
  const playbackParts = createPlaybackParts(sentence, partOrder);

  if (playbackParts.length === 0) {
    throw new Error('Both original sentence and translation cannot be empty.');
  }

  for (const part of playbackParts) {
    const flowState = await flowController.waitIfPaused();

    if (flowState === PlaybackFlowState.Stopped) {
      return AudioPlaybackResult.Stopped;
    }

    const audioBlob = await getSpeechAudio({
      lang: part.lang,
      text: part.text,
      signal: abortSignal,
    });

    const result = await playAudio(audioBlob);

    if (result !== AudioPlaybackResult.Ended) {
      return result;
    }
  }

  return AudioPlaybackResult.Ended;
}

export async function runPlaybackSession({
  sentences,
  getPartOrder,
  getPlaybackMode,
  getLoopPlayback,
  flowController,
  startSentenceId,
  onPlayingSentenceIdChange,
  abortSignal,
}: PlaybackSessionOptions): Promise<AudioPlaybackResultType> {
  let shouldContinue = true;
  // Apply the start sentence only to the first playback cycle.
  let firstCycleStartSentenceId = startSentenceId;

  while (shouldContinue) {
    const loopPlayback = getLoopPlayback();
    const playbackQueue = createPlaybackQueue(sentences, getPlaybackMode());
    const sessionQueue = firstCycleStartSentenceId
      ? createQueueFromSentence(
          playbackQueue,
          firstCycleStartSentenceId,
          loopPlayback
        )
      : playbackQueue;

    firstCycleStartSentenceId = undefined; // Clear after first use

    for (const sentence of sessionQueue) {
      onPlayingSentenceIdChange(sentence.id); // Update currently playing sentence ID for UI state

      const result = await playSentenceParts(
        sentence,
        getPartOrder(),
        flowController,
        abortSignal
      );

      // Stop the entire queue if playback was stopped or an error occurred.
      if (result !== AudioPlaybackResult.Ended) {
        return result;
      }
    }

    // Check loopPlayback again in case it was changed during playback
    if (!getLoopPlayback()) {
      shouldContinue = false;
    }
  }

  return AudioPlaybackResult.Ended;
}

function createQueueFromSentence(
  queue: SentenceItem[],
  startSentenceId?: string,
  loopPlayback = false
): SentenceItem[] {
  if (!startSentenceId) return queue;

  const startIndex = queue.findIndex((s) => s.id === startSentenceId);

  if (startIndex === -1) return queue;

  return loopPlayback
    ? [...queue.slice(startIndex), ...queue.slice(0, startIndex)]
    : queue.slice(startIndex);
}
