export type PlaybackResult = 'ended' | 'stopped';
export type PlaybackState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'ended'
  | 'error';

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let resolveCurrent: ((result: PlaybackResult) => void) | null = null;
let currentPlaybackId = 0;
let playbackState: PlaybackState = 'idle';

export function getPlaybackState(): PlaybackState {
  return playbackState;
}

export function stopAudio(): void {
  const hasActivePlayback = currentAudio || currentAudioUrl || resolveCurrent;
  if (!hasActivePlayback) return;

  playbackState = 'stopped';

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }

  resolveCurrent?.('stopped');
  resolveCurrent = null;
}

export function pauseAudio(): void {
  if (!currentAudio || playbackState !== 'playing') return;

  currentAudio.pause();
  playbackState = 'paused';
}

export async function resumeAudio(): Promise<void> {
  if (!currentAudio || playbackState !== 'paused') return;

  try {
    await currentAudio.play();
    playbackState = 'playing';
  } catch {
    stopAudio();
    playbackState = 'error';
    throw new Error('Failed to resume audio playback.');
  }
}

export async function playAudio(blob: Blob): Promise<PlaybackResult> {
  if (blob.size === 0) {
    playbackState = 'error';
    throw new Error('Audio blob is empty.');
  }

  stopAudio(); // Stop any existing audio before playing new one
  playbackState = 'loading';

  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  const playbackId = ++currentPlaybackId; // Increment playback ID for this new audio instance

  currentAudio = audio;
  currentAudioUrl = audioUrl;

  // Create a promise that resolves when playback ends or is stopped
  const playbackFinished = new Promise<PlaybackResult>((resolve, reject) => {
    resolveCurrent = resolve;

    audio.onended = () => {
      playbackState = 'ended';
      cleanup(audio, audioUrl, playbackId);
      resolve('ended');
    };

    audio.onerror = () => {
      playbackState = 'error';
      cleanup(audio, audioUrl, playbackId);
      reject(new Error('Audio playback failed.'));
    };
  });

  try {
    await audio.play();
    playbackState = 'playing';
  } catch {
    cleanup(audio, audioUrl, playbackId);
    playbackState = 'error';
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
