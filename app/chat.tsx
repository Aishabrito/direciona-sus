import { useRef, useState } from 'react';
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
import { Logo } from '../components/Logo';
import { COR, DEGRADE, FONTE } from '../constants/tema';
import { enviarAoBot, buscarUnidades, novaSessao, type OfertaLocal } from '../ia/remoto';
import { respostaOffline, TEXTO_SEM_CONEXAO } from '../ia/offline';

// Chat no mesmo formato do WhatsApp: a orientação, a oferta de "unidade mais
// próxima" e a lista de unidades aparecem como mensagens da conversa.

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  isFinal?: boolean; // orientação final (texto em verde)
};

const agora = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let contador = 0;
const novoId = () => `${Date.now()}-${contador++}`;

const BOAS_VINDAS =
  'Olá! Sou o assistente do Direciona.Ai. Me conta o que você está sentindo que eu te ajudo a saber onde buscar atendimento no SUS.';

const SUGESTOES = [
  'Febre há 4 dias e muita fraqueza',
  'Dor no peito e falta de ar',
  'Vacinação',
  'Queda e bateu a cabeça',
];

// Mesmo critério do WhatsApp (pareceLocal no bot.ts, simplificado): resposta curta,
// sem pergunta e sem sintoma = bairro/cidade. Senão, a pessoa voltou a falar de saúde.
const SINTOMA_RE = /\b(dor|falta de ar|desmaio|sangr|febre|v[oô]mito|confus|tontura|peito|respir|convuls|acidente|queimad|pior|sinto|tosse|barriga|cabe[cç]a)/i;
function pareceEndereco(texto: string): boolean {
  const palavras = texto.trim().split(/\s+/);
  return palavras.length <= 7 && !texto.includes('?') && !SINTOMA_RE.test(texto);
}

// O bot usa a marcação do WhatsApp: *negrito* e _itálico_; links viram "abrir no mapa".
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
      return <Text key={i} style={{ fontStyle: 'italic' }}>{parte.slice(1, -1)}</Text>;
    }
    return parte;
  });
}

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [busy, setBusy] = useState(false);
  // Uma sessão por conversa no servidor (o mesmo bot do WhatsApp).
  const [sessionId, setSessionId] = useState(novaSessao);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'inicio', text: BOAS_VINDAS, sender: 'bot', time: agora() },
  ]);
  // Depois de uma orientação: qual unidade oferecer e se estamos esperando a localização.
  const [oferta, setOferta] = useState<OfertaLocal | null>(null);
  const [aguardandoLocal, setAguardandoLocal] = useState(false);
  const [teveOrientacao, setTeveOrientacao] = useState(false);

  const falar = (text: string, sender: Message['sender'], extra: Partial<Message> = {}) =>
    setMessages((prev) => [...prev, { id: novoId(), text, sender, time: agora(), ...extra }]);

  // Busca e mostra as unidades, como o executarBusca do WhatsApp.
  const mostrarUnidades = async (onde: { lat: number; lng: number } | { endereco: string }) => {
    if (!oferta) return;
    falar('🔎 Buscando as unidades mais próximas, um instante...', 'bot');
    const r = await buscarUnidades(oferta.tipo, onde);
    if (!r) {
      falar('❌ Não consegui buscar as unidades agora. Se for emergência, ligue *192* (SAMU).', 'bot');
      return;
    }
    falar(r.texto, 'bot');
    if (r.achouEndereco) setAguardandoLocal(false); // senão, continua esperando outro bairro
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || busy) return;

    setBusy(true);
    falar(text, 'user');
    if (!textToSend) setInputText('');

    try {
      // Resposta à oferta de localização: bairro e cidade digitados.
      if (aguardandoLocal && pareceEndereco(text)) {
        await mostrarUnidades({ endereco: text });
        return;
      }
      setAguardandoLocal(false);

      // Quem responde é o bot do servidor; sem conexão, só a guarda de emergência local.
      const resultado = (await enviarAoBot(sessionId, text)) ?? respostaOffline(text);
      const final = resultado.tipo === 'orientacao';
      falar(resultado.texto, 'bot', { isFinal: final });
      if (final) setTeveOrientacao(true);

      if (resultado.local) {
        setOferta(resultado.local);
        setAguardandoLocal(true);
        falar(
          `📍 *Quer saber ${resultado.local.rotulo}?* Toque em *Enviar minha localização* ou escreva seu *bairro e cidade*.`,
          'bot',
        );
      }
    } catch (error) {
      console.error('Erro no chat:', error);
      falar(TEXTO_SEM_CONEXAO, 'bot');
    } finally {
      setBusy(false);
    }
  };

  // Compartilhar a localização do celular (equivale ao 📎 → Localização do WhatsApp).
  const enviarLocalizacao = async () => {
    if (busy) return;
    if (!oferta) {
      falar('Primeiro me conta o que você está sentindo, que eu indico o tipo de unidade e busco a mais próxima.', 'bot');
      return;
    }
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        falar('Sem permissão de localização. Você pode escrever seu *bairro e cidade* que eu busco.', 'bot');
        setAguardandoLocal(true);
        return;
      }
      falar('📍 Localização enviada', 'user');
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await mostrarUnidades({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (error) {
      console.error('Erro na localização:', error);
      falar('Não consegui pegar sua localização. Escreva seu *bairro e cidade* que eu busco.', 'bot');
      setAguardandoLocal(true);
    } finally {
      setBusy(false);
    }
  };

  const recusarLocalizacao = () => {
    setAguardandoLocal(false);
    falar('Agora não', 'user');
    falar('Tudo bem! Se precisar, é só me chamar. 💙', 'bot');
  };

  const handleReiniciar = () => {
    setSessionId(novaSessao());
    setOferta(null);
    setAguardandoLocal(false);
    setTeveOrientacao(false);
    setInputText('');
    setMessages([{ id: novoId(), text: BOAS_VINDAS, sender: 'bot', time: agora() }]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View className={`my-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <View
          style={{
            maxWidth: '82%',
            padding: 16,
            borderRadius: 18,
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
            backgroundColor: isUser ? undefined : COR.branco,
            borderWidth: isUser ? 0 : 1,
            borderColor: isUser ? 'transparent' : COR.borda,
            shadowColor: COR.azul,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isUser ? 0.25 : 0.06,
            shadowRadius: 8,
            elevation: isUser ? 4 : 1,
          }}
        >
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
            <Text
              className={`text-[15px] leading-[22px] ${
                item.isFinal ? 'text-[#0b7a66] font-nunito-bold' : 'text-[#034268] font-nunito'
              }`}
            >
              {textoFormatado(item.text, COR.verdeEscuro)}
            </Text>
          )}
        </View>
        <Text className="text-[11px] text-slate-400 font-nunito mt-1">{item.time}</Text>
      </View>
    );
  };

  // Atalhos acima do campo de texto, conforme o momento da conversa.
  const atalhos: { rotulo: string; acao: () => void; destaque?: boolean }[] = [];
  if (aguardandoLocal) {
    atalhos.push({ rotulo: '📍 Enviar minha localização', acao: enviarLocalizacao, destaque: true });
    atalhos.push({ rotulo: 'Agora não', acao: recusarLocalizacao });
  } else if (messages.length === 1) {
    SUGESTOES.forEach((s) => atalhos.push({ rotulo: s, acao: () => handleSend(s) }));
  }
  if (teveOrientacao) atalhos.push({ rotulo: '🔄 Nova consulta', acao: handleReiniciar });

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
          // rola para a última mensagem sempre que o conteúdo cresce (inclusive listas longas)
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          style={{ flex: 1 }}
        />

        {atalhos.length > 0 && (
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
            {/* "+" = enviar localização (como o 📎 do WhatsApp) */}
            <TouchableOpacity
              onPress={enviarLocalizacao}
              disabled={busy}
              accessibilityLabel="Enviar minha localização"
              className="w-11 h-11 rounded-full bg-[#034268] items-center justify-center"
            >
              <Ionicons name="location-outline" size={21} color="#ffffff" />
            </TouchableOpacity>

            {/* Campo de texto com efeito "afundado" */}
            <View style={[styles.textField, { flex: 1 }]}>
              <TextInput
                placeholder={aguardandoLocal ? 'Bairro e cidade...' : 'Digite sua mensagem...'}
                placeholderTextColor="#94a3b8"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
                editable={!busy}
                className="flex-1 text-sm font-nunito text-[#1d3b53]"
              />
            </View>

            {/* Enviar */}
            <TouchableOpacity onPress={() => handleSend()} disabled={busy} style={styles.sendButtonShadow}>
              <LinearGradient
                colors={DEGRADE}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
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

  sendButtonShadow: Platform.select({
    ios: {
      width: 44, height: 44, borderRadius: 22,
      shadowColor: COR.azul, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.31, shadowRadius: 10,
    },
    android: { width: 44, height: 44, borderRadius: 22, elevation: 6 },
    default: { width: 44, height: 44, borderRadius: 22 },
  }) as ViewStyle,
});
