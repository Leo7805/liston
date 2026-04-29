# Liston

Liston is a browser-based listening practice app for language learning. Add English sentences and Chinese translations, then play them back through a text-to-speech API one sentence at a time or as a playlist.

Demo: <https://liston.jinleo.dev>

## Features

- Add sentence pairs with English and Chinese text
- Store saved sentences in browser `localStorage`
- Play a single sentence or the full sentence list
- Choose playback order: sequential, shuffle, least played first, or balanced
- Pause, resume, stop, and loop playlist playback
- Generate speech through a configurable `/tts` backend endpoint

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui-style components
- Radix UI
- lucide-react icons

## Requirements

- Node.js 20 or newer
- npm
- A TTS backend endpoint that accepts `POST /tts`

The frontend expects the TTS endpoint to receive JSON like:

```json
{
  "text": "Hello",
  "voiceName": "en-US-JennyNeural"
}
```

The endpoint should return audio bytes, for example `audio/mpeg`.

## Getting Started

Install dependencies:

```bash
cd web
npm install
```

Create `web/.env.local` with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_TTS_EN_VOICE=en-US-JennyNeural
NEXT_PUBLIC_TTS_ZH_VOICE=zh-CN-XiaoxiaoNeural
```

Start the development server:

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

## Scripts

Run from the `web/` directory:

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Project Structure

```text
.
├── README.md
└── web/
    ├── app/                 # Next.js app routes and global styles
    ├── components/          # App components and shared UI primitives
    ├── hook/                # Client-side React hooks
    ├── lib/                 # App configuration and utilities
    ├── public/              # Static assets
    ├── services/            # TTS, audio playback, and playback scheduling
    ├── types/               # Shared TypeScript types
    ├── package.json
    └── tsconfig.json
```

## Configuration

The app reads these public environment variables:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend TTS service |
| `NEXT_PUBLIC_TTS_EN_VOICE` | Voice name used for English text |
| `NEXT_PUBLIC_TTS_ZH_VOICE` | Voice name used for Chinese text |

## Notes

- Sentences are stored locally in the browser. Clearing browser storage removes the saved list.
- The repository currently contains the frontend app only. The backend TTS service must be run separately.
