import { config } from '@/lib/config';
import type { VoiceNameType } from '@/types/tts';

/**
 * TTS API wrapper: resolves configured voices and returns generated audio as a Blob.
 */

/**
 * @internal
 * Input parameters for generating speech audio. */
type GenerateTtsSpeechInput = {
  voiceName: VoiceNameType;
  text: string;
  signal?: AbortSignal;
};

/**
 * Generates speech audio for given text and voice, returning a Blob.
 */
export async function generateTtsSpeech({
  voiceName,
  text,
  signal,
}: GenerateTtsSpeechInput): Promise<Uint8Array> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error('Text cannot be empty.');
  }

  /** Call the TTS API to generate speech audio */
  const res = await fetch(`${config.apiBaseUrl}/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: normalizedText, voiceName }),
    signal,
  });

  /** Handle non-OK responses with detailed error messages */
  if (!res.ok) {
    let detail = `Failed to generate speech. (${res.status})`;

    try {
      const errorText = await res.text();
      const contentType = res.headers.get('Content-Type') ?? '';

      // Attempt to extract error details based on content type
      if (contentType.includes('application/json')) {
        const errorData = JSON.parse(errorText);
        detail = errorData.detail || errorData.message || detail;
      } else if (contentType.includes('text/html')) {
        // Common for 404 or server errors
        detail =
          res.status === 404
            ? 'TTS endpoint was not found. Please check the API base URL.'
            : `Speech service returned an HTML error page. (${res.status})`;
      } else if (errorText.trim()) {
        detail = errorText;
      }
    } catch {
      // keep default detail
    }

    throw new Error(detail);
  }

  const audioBuffer = await res.arrayBuffer();

  if (audioBuffer.byteLength === 0) {
    throw new Error('Received empty audio data from server.');
  }

  return new Uint8Array(audioBuffer);
}
