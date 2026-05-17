import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { getAudioUri } from '@/services/audio/ttsAudioResolver';
import { LanguageCode } from '@/types/tts';
import {
  clearSentencesAndInitializedFlag,
  clearSentencesFromStorage,
  isSentenceStorageEmpty,
} from '@/services/sentenceStore';
import AsyncStorage from '@react-native-async-storage/async-storage/lib/typescript/AsyncStorage';

export default function App() {
  const { t, toggleAppLanguage } = useI18n();
  const [text, setText] = useState('Hello, how are you?');
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Debug info
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const player = useAudioPlayer(audioUri ? { uri: audioUri } : undefined);
  const status = useAudioPlayerStatus(player);

  /* Generate audio for the input text using TTS and cache it, then play it */
  async function generateAudio() {
    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const lang = LanguageCode.English;
      const audioUri = await getAudioUri(lang, text);
      setAudioUri(audioUri);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      console.error('❌ Failed to generate audio:', err);
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('app.title')}</Text>
      <Button title={t('app.switchLanguage')} onPress={toggleAppLanguage} />

      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
      />

      <Button
        title={isGenerating ? t('actions.generating') : t('actions.generate')}
        disabled={isGenerating || !text.trim()}
        onPress={generateAudio}
      />

      <Button
        title={t('actions.play')}
        disabled={!audioUri}
        onPress={async () => {
          await player.seekTo(0);
          await player.play();
        }}
      />

      <Button
        title={t('actions.pause')}
        disabled={!status.playing}
        onPress={() => player.pause()}
      />

      <Button
        title="清空句子 AsyncStorage" // This button is for testing sentence storage management
        onPress={async () => {
          await clearSentencesFromStorage();
        }}
      />

      <Button
        title="清空句子及 AsyncStorage 及 Initialized 标记" // This button is for testing AsyncStorage management
        onPress={async () => {
          await clearSentencesAndInitializedFlag();
        }}
      />

      {isGenerating && <Text>{t('actions.generating')}</Text>}
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
});
