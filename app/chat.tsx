import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StatusBar,
  StyleSheet,
  ViewStyle,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { Logo } from '../components/Logo';
import { COR, DEGRADE, FONTE } from '../constants/tema';
import {
  enviarTexto, enviarAudio, enviarLocalizacao, buscarBoasVindas, novaSessao,
  type RespostaBot,
} from '../ia/remoto';
import { respostaOffline, semConexao, AUDIO_SEM_CONEXAO, TEXTO_SEM_CONEXAO } from '../ia/offline';
import { lerGravacao, tocarResposta, pararResposta } from '../ia/audio';

// O chat é o mesmo atendimento do WhatsApp (back.direciona): texto, áudio, localização,
// comandos ("início", "apagar") e a lista de unidades chegam como mensagens da conversa.
// O app só desenha as mensagens, grava/toca áudio e pega a localização do celular.

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  audio?: { base64: string; mime: string }; // resposta falada (quem mandou áudio)
};

const agora = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let contador = 0;
const novoId = () => `${Date.now()}-${contador++}`;

// Usada se o servidor não responder ao abrir o chat (a original vem de /api/boas-vindas).
const BOAS_VINDAS_RESERVA =
  '👋 Olá! Eu sou o *Direciona.Ai*. Me conta o que você está sentindo (por *texto ou áudio* 🎤) ' +
  'que eu te digo onde buscar atendimento no SUS. Em emergência, ligue *192*.';

const SUGESTOES = [
  'Febre há 4 dias e muita fraqueza',
  'Dor no peito e falta de ar',
  'Qual a diferença entre UBS e UPA?',
  'Onde tem uma UPA?',
];

// O bot usa a marcação do WhatsApp: *negrito* e _itálico_; links viram "Abrir rota no mapa".
function textoFormatado(texto: string, corLink: string) {
  return texto.split(/(https?:\/\/\S+|\*[^*\n]+\*|_[^_\n]+_)/g).map((parte, i) => {
    if (/^https?:\/\//.test(parte)) {
      return (
        <Text
          key={i}
          style={{ color: corLink, fontFamily: FONTE.extrabold, textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL(parte)}
        >
          Abrir rota no mapa
        </Text>
      );
    }
    if (/^\*[^*]+\*$/.test(parte)) {
      return <Text key={i} style={{ fontFamily: FONTE.extrabold }}>{parte.slice(1, -1)}</Text>;
    }
    if (/^_[^_]+_$/.test(parte)) {
      // itálico pode ter negrito dentro (ex.: o rodapé "_...mandar *início*._")
      return <Text key={i} style={{ fontStyle: 'italic' }}>{textoFormatado(parte.slice(1, -1), corLink)}</Text>;
    }
    return parte;
  });
}

const duracao = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(novaSessao); // uma conversa no servidor por abertura do chat
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'boas-vindas', text: BOAS_VINDAS_RESERVA, sender: 'bot', time: agora() },
  ]);
  // O bot ofereceu "a UPA mais próxima" e espera a localização (vem do servidor).
  const [aguardandoLocal, setAguardandoLocal] = useState(false);

  const gravador = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estadoGravador = useAudioRecorderState(gravador, 250);
  const [gravando, setGravando] = useState(false);

  // Mesma apresentação que o WhatsApp manda na 1ª mensagem.
  useEffect(() => {
    buscarBoasVindas().then((texto) => {
      if (texto) setMessages((prev) => prev.map((m) => (m.id === 'boas-vindas' ? { ...m, text: texto } : m)));
    });
    return () => pararResposta();
  }, []);

  const adicionar = (m: Omit<Message, 'id' | 'time'>) =>
    setMessages((prev) => [...prev, { id: novoId(), time: agora(), ...m }]);

  const receber = (resposta: RespostaBot) => {
    setMessages((prev) => [
      ...prev,
      ...resposta.mensagens.map((m) => ({
        id: novoId(), time: agora(), sender: 'bot' as const, text: m.texto, audio: m.audio,
      })),
    ]);
    setAguardandoLocal(resposta.aguardandoLocalizacao);
  };

  /** Envia texto (inclusive comandos e respostas como "sim", "não", bairro e cidade). */
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || busy) return;
    setBusy(true);
    adicionar({ text, sender: 'user' });
    if (!textToSend) setInputText('');
    try {
      // Sem conexão, só a guarda de emergência local responde.
      receber((await enviarTexto(sessionId, text)) ?? respostaOffline(text));
    } catch (error) {
      console.error('Erro no chat:', error);
      receber(semConexao(TEXTO_SEM_CONEXAO));
    } finally {
      setBusy(false);
    }
  };

  // Compartilhar a localização do celular (o 📎 → Localização do WhatsApp).
  const handleLocalizacao = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        adicionar({ text: 'Sem permissão de localização. Você pode escrever seu *bairro e cidade* que eu busco.', sender: 'bot' });
        return;
      }
      adicionar({ text: '📍 Localização enviada', sender: 'user' });
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const resposta = await enviarLocalizacao(sessionId, pos.coords.latitude, pos.coords.longitude);
      receber(resposta ?? semConexao('Estou sem conexão para buscar as unidades agora. Se for emergência, ligue *192*.'));
    } catch (error) {
      console.error('Erro na localização:', error);
      adicionar({ text: 'Não consegui pegar sua localização. Escreva seu *bairro e cidade* que eu busco.', sender: 'bot' });
    } finally {
      setBusy(false);
    }
  };

  // ── Áudio: toque no microfone para gravar; toque em enviar para mandar ──
  const iniciarGravacao = async () => {
    if (busy || gravando) return;
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        adicionar({ text: 'Sem permissão de microfone. Você pode escrever sua mensagem.', sender: 'bot' });
        return;
      }
      pararResposta();
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await gravador.prepareToRecordAsync();
      gravador.record();
      setGravando(true);
    } catch (error) {
      console.error('Erro ao gravar:', error);
      adicionar({ text: 'Não consegui usar o microfone agora. Tente escrever sua mensagem.', sender: 'bot' });
    }
  };

  const encerrarGravacao = async (enviar: boolean) => {
    if (!gravando) return;
    const tempo = estadoGravador.durationMillis;
    setGravando(false);
    try {
      await gravador.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
      if (!enviar || !gravador.uri) return;
      if (tempo < 700) {
        adicionar({ text: 'Áudio muito curto. Toque no microfone, fale e depois toque em enviar.', sender: 'bot' });
        return;
      }
      setBusy(true);
      adicionar({ text: `🎤 Áudio (${duracao(tempo)})`, sender: 'user' });
      const { base64, mime } = await lerGravacao(gravador.uri);
      receber((await enviarAudio(sessionId, base64, mime)) ?? semConexao(AUDIO_SEM_CONEXAO));
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      receber(semConexao(AUDIO_SEM_CONEXAO));
    } finally {
      setBusy(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`my-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <View style={[styles.bolha, isUser ? styles.bolhaUser : styles.bolhaBot]}>
          {isUser ? (
            <LinearGradient
              colors={DEGRADE}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 18, borderBottomRightRadius: 4, padding: 16, margin: -16 }}
            >
              <Text className="text-white font-nunito text-[15px] leading-[22px]">
                {textoFormatado(item.text, COR.branco)}
              </Text>
            </LinearGradient>
          ) : (
            <>
              <Text className="text-[15px] leading-[22px] text-[#034268] font-nunito">
                {textoFormatado(item.text, COR.verdeEscuro)}
              </Text>
              {item.audio && (
                <TouchableOpacity
                  style={styles.ouvir}
                  onPress={() => tocarResposta(item.id, item.audio!.base64, item.audio!.mime)}
                  accessibilityLabel="Ouvir a resposta"
                >
                  <Ionicons name="play" size={16} color={COR.branco} />
                  <Text style={styles.ouvirTexto}>Ouvir resposta</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        <Text className="text-[11px] text-slate-400 font-nunito mt-1">{item.time}</Text>
      </View>
    );
  };

  // Atalhos acima do campo de texto, conforme o momento da conversa.
  const ultimaDoBot = [...messages].reverse().find((m) => m.sender === 'bot')?.text ?? '';
  const atalhos: { rotulo: string; acao: () => void; destaque?: boolean }[] = [];
  if (aguardandoLocal) {
    atalhos.push({ rotulo: '📍 Enviar minha localização', acao: handleLocalizacao, destaque: true });
    atalhos.push({ rotulo: 'Agora não', acao: () => handleSend('não') });
  } else if (messages.length === 1) {
    SUGESTOES.forEach((s) => atalhos.push({ rotulo: s, acao: () => handleSend(s) }));
  }
  // O bot fecha o atendimento com "...é só mandar início" (igual ao WhatsApp).
  if (/mandar \*início\*/.test(ultimaDoBot)) {
    atalhos.push({ rotulo: '🔄 Novo atendimento', acao: () => handleSend('início') });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COR.fundo }}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho claro com o logo */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={COR.azul} />
        </TouchableOpacity>
        <Logo largura={128} />
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          // rola para a última mensagem sempre que o conteúdo cresce
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          style={{ flex: 1 }}
          ListFooterComponent={
            busy ? <Text style={styles.digitando}>Direciona.Ai está digitando…</Text> : null
          }
        />

        {atalhos.length > 0 && !gravando && (
          <View className="flex-row flex-wrap justify-center gap-2 px-4 py-2">
            {atalhos.map(({ rotulo, acao, destaque }) => (
              <TouchableOpacity
                key={rotulo}
                onPress={acao}
                disabled={busy}
                className={`px-4 py-2 rounded-full border shadow-sm ${
                  destaque ? 'bg-[#14bc9a] border-[#14bc9a]' : 'bg-white border-[#dde5ec]'
                }`}
              >
                <Text className={`font-nunito-bold text-xs ${destaque ? 'text-white' : 'text-[#034268]'}`}>
                  {rotulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputBar}>
          <View className="flex-row items-center gap-2.5">
            {gravando ? (
              <>
                {/* Gravando: cancelar, tempo e enviar */}
                <TouchableOpacity
                  onPress={() => encerrarGravacao(false)}
                  accessibilityLabel="Cancelar áudio"
                  className="w-11 h-11 rounded-full bg-white items-center justify-center border border-[#dde5ec]"
                >
                  <Ionicons name="trash-outline" size={20} color={COR.azul} />
                </TouchableOpacity>
                <View style={[styles.textField, { flex: 1 }]}>
                  <View style={styles.pontoGravando} />
                  <Text style={styles.gravandoTexto}>
                    Gravando {duracao(estadoGravador.durationMillis)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* 📍 = enviar localização (como o 📎 → Localização do WhatsApp) */}
                <TouchableOpacity
                  onPress={handleLocalizacao}
                  disabled={busy}
                  accessibilityLabel="Enviar minha localização"
                  className="w-11 h-11 rounded-full bg-[#034268] items-center justify-center"
                >
                  <Ionicons name="location-outline" size={21} color="#ffffff" />
                </TouchableOpacity>

                {/* Campo de texto com o microfone dentro (toque para gravar um áudio) */}
                <View style={[styles.textField, { flex: 1 }]}>
                  <TextInput
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor="#94a3b8"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => handleSend()}
                    returnKeyType="send"
                    editable={!busy}
                    className="flex-1 text-sm font-nunito text-[#1d3b53]"
                  />
                  <TouchableOpacity onPress={iniciarGravacao} disabled={busy} accessibilityLabel="Gravar áudio">
                    <Ionicons name="mic-outline" size={20} color={COR.azul} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Enviar texto, ou enviar o áudio que está sendo gravado */}
            <TouchableOpacity
              onPress={() => (gravando ? encerrarGravacao(true) : handleSend())}
              disabled={busy}
              accessibilityLabel={gravando ? 'Enviar áudio' : 'Enviar mensagem'}
              style={styles.sendButtonShadow}
            >
              <LinearGradient
                colors={DEGRADE}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={gravando ? 'send' : 'arrow-forward'} size={18} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Sombras via StyleSheet nativo (classes arbitrárias tipo shadow-[inset_...]
// não renderizam no React Native).
const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COR.branco,
    borderBottomWidth: 1,
    borderBottomColor: COR.borda,
  },

  bolha: {
    maxWidth: '84%',
    padding: 16,
    borderRadius: 18,
    shadowColor: COR.azul,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  bolhaUser: { borderBottomRightRadius: 4, shadowOpacity: 0.25, elevation: 4 },
  bolhaBot: {
    borderBottomLeftRadius: 4,
    backgroundColor: COR.branco,
    borderWidth: 1,
    borderColor: COR.borda,
    shadowOpacity: 0.06,
    elevation: 1,
  },

  ouvir: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COR.verde,
  },
  ouvirTexto: { color: COR.branco, fontFamily: FONTE.extrabold, fontSize: 13 },

  digitando: { fontFamily: FONTE.regular, fontStyle: 'italic', color: COR.textoSuave, fontSize: 13, marginTop: 6 },

  inputBar: {
    backgroundColor: 'rgba(240,244,248,0.8)',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 14,
    ...Platform.select({
      ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },

  // Bordas bicolor (mais escura em cima/esquerda) simulam o campo "afundado".
  textField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#edf1f7',
    paddingHorizontal: 16,
    gap: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: 'rgba(160,172,194,0.45)',
    borderLeftColor: 'rgba(160,172,194,0.45)',
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(255,255,255,0.9)',
    ...Platform.select({
      ios: { shadowColor: '#b2bdcc', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.25, shadowRadius: 1.5 },
      android: { elevation: 1 },
    }),
  },

  pontoGravando: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e5484d' },
  gravandoTexto: { fontFamily: FONTE.bold, color: COR.azul, fontSize: 14 },

  sendButtonShadow: Platform.select({
    ios: {
      width: 44, height: 44, borderRadius: 22,
      shadowColor: COR.azul, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.31, shadowRadius: 10,
    },
    android: { width: 44, height: 44, borderRadius: 22, elevation: 6 },
    default: { width: 44, height: 44, borderRadius: 22 },
  }) as ViewStyle,
});
