// Manages single audio playback

export const AudioPlaybackResult = {
  Ended: 'ended',
  Stopped: 'stopped',
} as const;

export type AudioPlaybackResultType =
  (typeof AudioPlaybackResult)[keyof typeof AudioPlaybackResult];

export const AudioPlaybackState = {
  Idle: 'idle',
  Loading: 'loading',
  Playing: 'playing',
  Paused: 'paused',
  Stopped: 'stopped',
  Ended: 'ended',
  Error: 'error',
} as const;

export type AudioPlaybackStateType =
  (typeof AudioPlaybackState)[keyof typeof AudioPlaybackState];

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let resolveCurrent: ((result: AudioPlaybackResultType) => void) | null = null;
let currentPlaybackId = 0;
let playbackState: AudioPlaybackStateType = AudioPlaybackState.Idle;

export function getPlaybackState(): AudioPlaybackStateType {
  return playbackState;
}

export function stopAudio(): void {
  const hasActivePlayback = currentAudio || currentAudioUrl || resolveCurrent;
  if (!hasActivePlayback) return;

  playbackState = AudioPlaybackState.Stopped;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }

  resolveCurrent?.(AudioPlaybackResult.Stopped);
  resolveCurrent = null;
}

export function pauseAudio(): void {
  if (!currentAudio || playbackState !== AudioPlaybackState.Playing) return;

  currentAudio.pause();
  playbackState = AudioPlaybackState.Paused;
}

export async function resumeAudio(): Promise<void> {
  if (!currentAudio || playbackState !== AudioPlaybackState.Paused) return;

  try {
    await currentAudio.play();
    playbackState = AudioPlaybackState.Playing;
  } catch {
    stopAudio();
    playbackState = AudioPlaybackState.Error;
    throw new Error('Failed to resume audio playback.');
  }
}

export async function playAudio(blob: Blob): Promise<AudioPlaybackResultType> {
  if (blob.size === 0) {
    playbackState = AudioPlaybackState.Error;
    throw new Error('Audio blob is empty.');
  }

  stopAudio(); // Stop any existing audio before playing new one
  playbackState = AudioPlaybackState.Loading;

  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  const playbackId = ++currentPlaybackId; // Increment playback ID for this new audio instance

  currentAudio = audio;
  currentAudioUrl = audioUrl;

  // Create a promise that resolves when playback ends or is stopped
  const playbackFinished = new Promise<AudioPlaybackResultType>(
    (resolve, reject) => {
      resolveCurrent = resolve;

      audio.onended = () => {
        playbackState = AudioPlaybackState.Ended;
        cleanup(audio, audioUrl, playbackId);
        resolve(AudioPlaybackResult.Ended);
      };

      audio.onerror = () => {
        playbackState = AudioPlaybackState.Error;
        cleanup(audio, audioUrl, playbackId);
        reject(new Error('Audio playback failed.'));
      };
    }
  );

  try {
    await audio.play();
    playbackState = AudioPlaybackState.Playing;
  } catch {
    cleanup(audio, audioUrl, playbackId);
    playbackState = AudioPlaybackState.Error;
    throw new Error('Audio playback was blocked or failed.');
  }

  return playbackFinished;
}

function cleanup(
  audio: HTMLAudioElement,
  audioUrl: string,
  playbackId: number
) {
  if (currentAudio === audio) {
    // Only clear if it's still the current one (avoid race condition)
    currentAudio = null;
  }

  if (currentAudioUrl === audioUrl) {
    // Only revoke if it's still the current one (avoid race condition)
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }

  if (currentPlaybackId === playbackId) {
    // Only clear resolver if it's still the current playback.
    resolveCurrent = null;
  }
}
