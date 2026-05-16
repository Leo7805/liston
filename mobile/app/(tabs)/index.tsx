import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState } from 'react';
import Constants from 'expo-constants';
import { useI18n } from '@/i18n/useI18n';
import { getAudioUri } from '@/services/audio/ttsAudioResolver';
import { LanguageCode } from '@/types/tts';

export default function App() {
  const { t, toggleAppLanguage } = useI18n();
  const [text, setText] = useState('Hello, how are you?');
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Debug info
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const player = useAudioPlayer(audioUri ? { uri: audioUri } : undefined);
  const status = useAudioPlayerStatus(player);

  async function generateAudio() {
    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const lang = LanguageCode.English;
      const audioUri = await getAudioUri(lang, text);
      setAudioUri(audioUri);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      console.error('❌ Failed to generate audio:', err);
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

      <Button title={t('actions.pause')} onPress={() => player.pause()} />

      <Text>Current Uri: {Constants.expoConfig?.hostUri}</Text>
      <Text>Loaded: {String(status.isLoaded)}</Text>
      <Text>Playing: {String(status.playing)}</Text>
      {isGenerating && <Text>Generating audio...</Text>}
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
