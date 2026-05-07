'use client';

// Renders one saved sentence with play and delete actions.

import { Button } from '@/components/ui/button';
import type { SentenceItem } from '@/types/sentences';
import { Volume2, Trash2 } from 'lucide-react';

type SentenceRowProps = {
  sentence: SentenceItem;
  index: number;
  isPlaying: boolean;
  isPlayingAll: boolean;
  onPlaySentence: (sentence: SentenceItem) => void;
  onDeleteSentence: (id: string) => void;
};

export function SentenceRow({
  sentence,
  index,
  isPlaying,
  isPlayingAll,
  onPlaySentence,
  onDeleteSentence,
}: SentenceRowProps) {
  const volumeIconClassName = isPlaying
    ? 'animate-pulse text-emerald-500'
    : 'text-muted-foreground';
  const indexClassName = isPlaying
    ? 'text-sm text-emerald-500'
    : 'text-sm text-muted-foreground';

  const englishClassName = isPlaying
    ? 'font-medium text-emerald-500'
    : 'font-medium';

  const translationClassName = isPlaying
    ? 'ml-3 text-sm text-emerald-500'
    : 'ml-3 text-sm text-muted-foreground';

  function handlePlaySentence() {
    onPlaySentence(sentence);
  }

  function handleDeleteSentence() {
    onDeleteSentence(sentence.id);
  }

  return (
    <div className="py-1">
      <div className="flex items-start gap-3">
        {/* Play button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-blue-500"
          onClick={handlePlaySentence}
          aria-label="Play sentence"
        >
          <Volume2 className={volumeIconClassName} />
        </Button>

        {/* Sentence text */}
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[2rem_1fr] gap-x-2 leading-5">
            <span className={indexClassName}>{index + 1}.</span>

            <p className="min-w-0">
              <span className={englishClassName}>{sentence.en}</span>
              <span className={translationClassName}>{sentence.zh}</span>
            </p>
          </div>
        </div>

        {/* Delete button */}
        <Button
          variant="destructive"
          size="icon-sm"
          className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-destructive"
          disabled={isPlaying || isPlayingAll}
          onClick={handleDeleteSentence}
          aria-label="Delete sentence"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
