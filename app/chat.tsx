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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ESTADO_INICIAL, processarTurno, type EstadoConversa } from '../ia';
import { useApp } from '../context/AppContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
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

  const [estado, setEstado] = useState<EstadoConversa>(() => montarEstadoInicial(perfil));
  const [busy, setBusy] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá. Descreva os sintomas em linguagem simples. Eu organizo o relato; as regras do Direciona SUS escolhem a orientação. Isso não é diagnóstico nem substitui atendimento. Não envie CPF, endereço, senha ou cartão.',
      sender: 'bot',
      time: agora(),
    },
  ]);

  // Auto-scroll
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
    const text = (textToSend || inputText).trim();
    if (!text || busy) return;

    setBusy(true);
    setMessages((prev) => [...prev, { id: String(Date.now()), text, sender: 'user', time: agora() }]);
    if (!textToSend) setInputText('');

    try {
      const { resultado, estado: novoEstado } = await processarTurno(text, estado);
      setEstado(novoEstado);

      if (resultado.tipo === 'orientacao') {
        // Navega para direcionamento com dados seguros
        const params = {
          unidade: resultado.decisao.destino,
          motivo: resultado.texto,
          acoes: resultado.texto,
          telefone: resultado.decisao.destino.includes('SAMU') ? '192' : '',
        };
        router.push({
          pathname: '/direcionamento',
          params: {
            unidade: encodeURIComponent(params.unidade),
            motivo: encodeURIComponent(params.motivo),
            acoes: encodeURIComponent(params.acoes),
            telefone: params.telefone,
          },
        });
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
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`my-1.5 max-w-[80%] p-3 rounded-2xl ${
        item.sender === 'user'
          ? 'self-end bg-sky-700 rounded-br-none'
          : 'self-start bg-sky-100 rounded-bl-none'
      }`}
    >
      <Text className={item.sender === 'user' ? 'text-white' : 'text-slate-800'}>
        {item.text}
      </Text>
      <Text
        className={`text-[10px] mt-1 text-right ${
          item.sender === 'user' ? 'text-sky-200' : 'text-gray-500'
        }`}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-sky-400">
      <View className="flex-row items-center px-4 py-3 bg-sky-600">
        <View className="w-10 h-10 rounded-full bg-sky-200 items-center justify-center mr-3">
          <Ionicons name="shield-checkmark" size={24} color="#0284c7" />
        </View>
        <View>
          <Text className="text-white text-lg font-bold">Direciona SUS</Text>
          <Text className="text-sky-100 text-xs">Orientação por regras · não é diagnóstico</Text>
        </View>
      </View>

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
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          className="flex-1"
        />

        <View className="flex-row flex-wrap justify-center gap-2 px-3 py-2">
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSend(item)}
              className="bg-sky-800 px-4 py-2 rounded-full border border-sky-300"
            >
              <Text className="text-white font-medium text-xs">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center p-3 gap-2 bg-sky-400">
          <View className="flex-1 flex-row items-center bg-sky-100 rounded-full px-4 py-2">
            <TextInput
              placeholder="Descreva os sintomas..."
              placeholderTextColor="#0369a1"
              value={inputText}
              onChangeText={setInputText}
              editable={!busy}
              className="flex-1 text-sky-950 pr-2"
            />
          </View>
          <TouchableOpacity
            onPress={() => handleSend()}
            className="w-12 h-12 bg-sky-200 rounded-full items-center justify-center"
            disabled={busy}
          >
            <Ionicons name="send" size={20} color="#0284c7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}