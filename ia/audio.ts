// Áudio no chat: ler a gravação em base64 (para enviar ao bot) e tocar a resposta falada.
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** Lê o arquivo gravado como base64. No celular é .m4a; no navegador, webm. */
export async function lerGravacao(uri: string): Promise<{ base64: string; mime: string }> {
  if (Platform.OS === 'web') {
    const blob = await (await fetch(uri)).blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result).split(',')[1] ?? '');
      leitor.onerror = reject;
      leitor.readAsDataURL(blob);
    });
    return { base64, mime: blob.type || 'audio/webm' };
  }
  return { base64: await new File(uri).base64(), mime: 'audio/mp4' };
}

let tocando: AudioPlayer | null = null;

/** Toca a resposta falada do bot (MP3 em base64). Para o áudio anterior, se houver. */
export async function tocarResposta(id: string, base64: string, mime: string): Promise<void> {
  pararResposta();
  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => {});
  let uri = `data:${mime};base64,${base64}`;
  if (Platform.OS !== 'web') {
    // No celular o player precisa de um arquivo: grava no cache uma vez por mensagem.
    const arquivo = new File(Paths.cache, `resposta-${id}.mp3`);
    if (!arquivo.exists) arquivo.write(base64, { encoding: 'base64' });
    uri = arquivo.uri;
  }
  tocando = createAudioPlayer({ uri });
  tocando.play();
}

export function pararResposta(): void {
  if (!tocando) return;
  try {
    tocando.pause();
    tocando.remove();
  } catch {}
  tocando = null;
}
