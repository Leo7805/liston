import { config } from '@/lib/config';

type TtsLang = 'en' | 'zh';

let currentAudio: HTMLAudioElement | null = null;

export async function speakText(text: string, lang: TtsLang): Promise<void> {
  if (!text.trim()) return;

  let audioUrl: string | null = null;
  let audio: HTMLAudioElement | null = null;

  try {
    const voiceName = lang === 'en' ? config.voices.en : config.voices.zh;

    const res = await fetch(`${config.apiBaseUrl}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voiceName }),
    });

    if (!res.ok) {
      let detail = 'Failed to generate speech';

      // Defensive parsing: res.json() may fail if response is not JSON, so fallback to res.text()
      try {
        const errorData = await res.json();
        detail = errorData.detail || errorData.message || detail;
      } catch {
        detail = await res.text();
      }

      throw new Error(detail);
    }

    const audioBuffer = await res.arrayBuffer();

    if (audioBuffer.byteLength === 0) {
      throw new Error('Received empty audio data from server.');
    }

    const contentType = res.headers.get('Content-Type') ?? 'audio/mpeg';
    const blob = new Blob([audioBuffer], { type: contentType });

    audioUrl = URL.createObjectURL(blob);
    audio = new Audio(audioUrl);

    // Stop previous audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = audio;

    try {
      await audio.play();
    } catch {
      throw new Error('Audio playback was blocked or failed.');
    }

    const activeAudio = audio;

    // Wait for playback to finish
    await new Promise<void>((resolve, reject) => {
      activeAudio.onended = () => resolve();
      activeAudio.onerror = () => reject(new Error('Audio playback failed.'));
    });
  } finally {
    // Only clear if it's still the current one (avoid race condition)
    if (currentAudio === audio) {
      currentAudio = null;
    }

    // Free blob memory
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }
}
