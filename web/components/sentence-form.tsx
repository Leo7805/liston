'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type SentenceFormProps = {
  onAddSentence: (en: string, zh: string) => void;
  disabled?: boolean;
};

export function SentenceForm({
  onAddSentence,
  disabled = false,
}: SentenceFormProps) {
  const [enSentence, setEnSentence] = useState('');
  const [zhTranslation, setZhTranslation] = useState('');

  function handleAddSentence() {
    onAddSentence(enSentence, zhTranslation);
    setEnSentence('');
    setZhTranslation('');
  }

  return (
    //  add sentence form
    // <section className="rounded-lg border p-4">
    //   <div>
    //     <h2 className="text-lg font-semibold">Add sentence</h2>
    //     <p className="mt-1 text-sm text-muted-foreground">
    //       Add an English sentence and its Chinese translation.
    //     </p>
    //   </div>

    // {/* input form */}
    <div className="space-y-3">
      <Textarea
        placeholder="English sentence"
        value={enSentence}
        onChange={(e) => setEnSentence(e.target.value)}
      />
      <Textarea
        placeholder="Chinese translation"
        value={zhTranslation}
        onChange={(e) => setZhTranslation(e.target.value)}
      />
      <Button
        className="cursor-pointer transition-colors hover:bg-primary/90"
        onClick={handleAddSentence}
        disabled={(!enSentence.trim() && !zhTranslation.trim()) || disabled}
      >
        Add sentence
      </Button>
    </div>
    // </section>
  );
}
