import { useRef, useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ESTADO_INICIAL, processarTurno, type EstadoConversa } from '../ia';
import { useApp } from '../context/AppContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  isFinal?: boolean;
};

const agora = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function montarEstadoInicial(perfil: any): EstadoConversa {
  const base = { ...ESTADO_INICIAL };
  if (perfil.idade) {
    let idade_grupo: 'bebe' | 'crianca' | 'adolescente' | 'adulto' | 'idoso' | 'nao_informado' = 'nao_informado';
    if (perfil.idade < 2) idade_grupo = 'bebe';
    else if (perfil.idade < 12) idade_grupo = 'crianca';
    else if (perfil.idade < 18) idade_grupo = 'adolescente';
    else if (perfil.idade < 60) idade_grupo = 'adulto';
    else idade_grupo = 'idoso';

    if (base.relatos.length > 0) {
      base.relatos[0] = {
        ...base.relatos[0],
        idade_grupo,
        gestante: perfil.gestante || 'nao_informado',
      };
    }
  }
  return base;
}

export default function ChatScreen() {
  const router = useRouter();
  const { perfil } = useApp();
  const flatListRef = useRef<FlatList>(null);
  const [finalizado, setFinalizado] = useState(false);

  const [estado, setEstado] = useState<EstadoConversa>(() => montarEstadoInicial(perfil));
  const [busy, setBusy] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do Direciona SUS. Estou aqui para orientar você sobre os serviços de saúde disponíveis. Como posso ajudar?',
      sender: 'bot',
      time: agora(),
    },
  ]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const suggestions = [
    'Febre há 4 dias e muita fraqueza',
    'Dor no peito e falta de ar',
    'Vacinação',
    'Queda e bateu a cabeça',
  ];

  const handleSend = async (textToSend?: string) => {
    if (finalizado) return;
    const text = (textToSend || inputText).trim();
    if (!text || busy) return;

    setBusy(true);
    setMessages((prev) => [...prev, { id: String(Date.now()), text, sender: 'user', time: agora() }]);
    if (!textToSend) setInputText('');

    try {
      const { resultado, estado: novoEstado } = await processarTurno(text, estado);
      setEstado(novoEstado);

      if (resultado.tipo === 'orientacao') {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            text: resultado.texto,
            sender: 'bot',
            time: agora(),
            isFinal: true,
          },
        ]);
        setFinalizado(true);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), text: resultado.texto, sender: 'bot', time: agora() },
      ]);
    } catch (error) {
      console.error('Erro no processarTurno:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          text: 'Não consegui avaliar com segurança. Procure uma UBS. Se houver falta de ar, dor no peito, desmaio, confusão ou sangramento importante, acione o SAMU 192.',
          sender: 'bot',
          time: agora(),
          isFinal: true,
        },
      ]);
      setFinalizado(true);
    } finally {
      setBusy(false);
    }
  };

  const handleReiniciar = () => {
    setFinalizado(false);
    setEstado(ESTADO_INICIAL);
    setMessages([
      {
        id: '1',
        text: 'Olá! Sou o assistente do Direciona SUS. Estou aqui para orientar você sobre os serviços de saúde disponíveis. Como posso ajudar?',
        sender: 'bot',
        time: agora(),
      },
    ]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const isFinal = item.isFinal || false;

    return (
      <View className={`my-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <View
          style={{
            maxWidth: '80%',
            padding: 16,
            borderRadius: isUser ? 18 : 18,
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
            backgroundColor: isUser
              ? undefined
              : '#ffffff',
            borderWidth: isUser ? 0 : 1,
            borderColor: isUser ? 'transparent' : '#e2eaf4',
            shadowColor: '#142e66',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isUser ? 0.25 : 0.06,
            shadowRadius: 8,
            elevation: isUser ? 4 : 1,
          }}
        >
          {isUser ? (
            <LinearGradient
              colors={['#142e66', '#3380b2', '#3ea8c0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 18,
                borderBottomRightRadius: 4,
                padding: 16,
                margin: -16,
              }}
            >
              <Text className="text-white font-medium text-sm leading-5">
                {item.text}
              </Text>
            </LinearGradient>
          ) : (
            <Text
              className={`text-sm leading-5 ${
                isFinal ? 'text-emerald-700 font-semibold' : 'text-[#525bab]'
              }`}
            >
              {item.text}
            </Text>
          )}
        </View>
        <Text className="text-[11px] text-slate-400 font-medium mt-1">
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f0f4f8]">
      <StatusBar barStyle="light-content" />

      {/* Header com gradiente */}
      <LinearGradient
        colors={['#142e66', '#3380b2', '#59d9d1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 8, paddingBottom: 12 }}
      >
        <View className="flex-row items-center justify-between px-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1"
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-[#142e66] text-3xl font-bold font-serif">
            Direciona Saude
          </Text>
          <View className="w-8" /> {/* placeholder para alinhar central */}
        </View>
      </LinearGradient>

      {/* Área de mensagens */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}
          className="flex-1"
        />

        {/* Sugestões e input (se não finalizado) */}
        {!finalizado ? (
          <>
            <View className="flex-row flex-wrap justify-center gap-2 px-4 py-2">
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleSend(item)}
                  className="bg-white px-4 py-2 rounded-full border border-[#e2eaf4] shadow-sm"
                >
                  <Text className="text-[#525bab] font-medium text-xs">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="bg-[#f0f4f8]/80 px-4 pb-2 pt-3.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <View className="flex-row items-center gap-2.5">
                {/* Botão de anexo (apenas visual) */}
                <TouchableOpacity
                  className="w-11 h-11 rounded-full bg-[#edf1f7] border-[1.5px] border-white items-center justify-center shadow-[3px_3px_6px_rgba(178,189,204,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]"
                  disabled
                >
                  <Ionicons name="attach" size={20} color="#525bab" />
                </TouchableOpacity>

                {/* Campo de texto com estilo neumorphism */}
                <View className="flex-1 h-11 rounded-full bg-[#edf1f7] border-[1.5px] border-white px-4 justify-center shadow-[inset_3px_3px_6px_rgba(178,189,204,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
                  <TextInput
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor="#94a3b8"
                    value={inputText}
                    onChangeText={setInputText}
                    editable={!busy}
                    className="text-sm font-medium text-slate-400"
                  />
                </View>

                {/* Botão de enviar com gradiente */}
                <TouchableOpacity
                  onPress={() => handleSend()}
                  disabled={busy}
                  className="w-11 h-11 rounded-full items-center justify-center shadow-[0px_4px_10px_rgba(20,46,102,0.31)]"
                >
                  <LinearGradient
                    colors={['#142e66', '#3380b2', '#3ea8c0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="send" size={18} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          // Tela finalizada – botão de reiniciar
          <View className="p-4 bg-[#f0f4f8] items-center">
            <TouchableOpacity
              onPress={handleReiniciar}
              className="bg-white px-8 py-3 rounded-full border border-[#e2eaf4] shadow-sm"
            >
              <Text className="text-[#525bab] font-bold text-sm tracking-wider">
                🔄 Nova consulta
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}