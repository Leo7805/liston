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
    let detail = 'Failed to generate speech';

    try {
      const errorText = await res.text();

      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          detail = errorData.detail || errorData.message || errorText;
        } catch {
          detail = errorText;
        }
      }
    } catch {
      // Keep default detail if the response body cannot be read.
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
