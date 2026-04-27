import { config } from '@/lib/config';

export type TtsLang = 'en' | 'zh';

export async function generateSpeech(
  text: string,
  lang: TtsLang
): Promise<Blob> {
  if (!text.trim()) {
    throw new Error('Text cannot be empty.');
  }

  const voiceName = lang === 'en' ? config.voices.en : config.voices.zh;

  const res = await fetch(`${config.apiBaseUrl}/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voiceName }),
  });

  // if (!res.ok) {
  //   let detail = 'Failed to generate speech';

  //   // Defensive parsing: res.json() may fail if response is not JSON, so fallback to res.text()
  //   try {
  //     const errorData = await res.json();
  //     detail = errorData.detail || errorData.message || detail;
  //   } catch {
  //     detail = await res.text();
  //   }

  //   throw new Error(detail);
  // }
  // Fix: Failed to execute 'text' on 'Response': body stream already read
  if (!res.ok) {
    let detail = `Failed to generate speech. (${res.status})`;

    try {
      const errorText = await res.text();
      const contentType = res.headers.get('Content-Type') ?? '';

      if (contentType.includes('application/json')) {
        const errorData = JSON.parse(errorText);
        detail = errorData.detail || errorData.message || detail;
      } else if (contentType.includes('text/html')) {
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

  const contentType = res.headers.get('Content-Type') ?? 'audio/mpeg';
  return new Blob([audioBuffer], { type: contentType });
}
