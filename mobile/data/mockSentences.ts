import { SentenceItem } from '@/features/sentences/sentence.types';

type MockSentence = Partial<Omit<SentenceItem, 'id'>> & {
  original: string;
  translation: string;
};

export const mockSentences: MockSentence[] = [
  {
    original: 'Hello world',
    translation: '你好，世界',
  },
  {
    original: 'How are you?',
    translation: '你好吗？',
  },
  {
    original:
      'I love programming. I love programming.I love programming.I love programming.I love programming.I love programming.',
    translation: '我爱编程。我爱编程。我爱编程。我爱编程。我爱编程。我爱编程。',
  },
  {
    original: "I'm flat out",
    translation: '我忙成狗',
  },
  {
    original: 'Heaps good',
    translation: '超棒',
  },
  {
    original: 'See you this arvo',
    translation: '下午见',
  },
  {
    original: 'How ya going?',
    translation: '你怎么样？',
  },
  {
    original: 'No dramas',
    translation: '没问题',
  },
  {
    original: 'Drop me at the servo',
    translation: '送我去加油站',
  },
];
