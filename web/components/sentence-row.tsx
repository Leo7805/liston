'use client';

import { Button } from '@/components/ui/button';
import type { SentenceItem } from '@/types/senteces';
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
  return (
    <div className="py-1">
      <div className="flex items-start gap-3">
        {/* play button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-blue-500"
          onClick={() => onPlaySentence(sentence)}
          aria-label="Play sentence"
        >
          <Volume2
            className={isPlaying ? 'animate-pulse text-emerald-500' : ''}
          />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[2rem_1fr] gap-x-2 leading-5">
            {/* <span className="text-sm text-muted-foreground">{index + 1}.</span> */}
            <span
              className={
                isPlaying
                  ? 'text-sm text-emerald-500'
                  : 'text-sm text-muted-foreground'
              }
            >
              {index + 1}.
            </span>

            <p className="min-w-0">
              {/* <span className="font-medium">{sentence.en}</span> */}
              <span
                className={
                  isPlaying ? 'font-medium text-emerald-500' : 'font-medium'
                }
              >
                {sentence.en}
              </span>
              {/* <span className="ml-3 text-sm text-muted-foreground">
                {sentence.zh}
              </span> */}
              <span
                className={
                  isPlaying
                    ? 'ml-3 text-sm text-emerald-500'
                    : 'ml-3 text-sm text-muted-foreground'
                }
              >
                {sentence.zh}
              </span>
            </p>
          </div>
        </div>

        {/* delete button */}
        <Button
          variant="destructive"
          size="icon-sm"
          className="h-auto cursor-pointer bg-transparent hover:bg-transparent text-muted-foreground hover:text-destructive"
          disabled={isPlaying || isPlayingAll}
          onClick={() => onDeleteSentence(sentence.id)}
          aria-label="Delete sentence"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
