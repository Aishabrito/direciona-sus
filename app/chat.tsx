import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ESTADO_INICIAL, processarTurno, type EstadoConversa } from '../ia';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
};

const agora = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ChatScreen() {
  const estadoRef = useRef<EstadoConversa>(ESTADO_INICIAL);
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
      const { resultado, estado } = await processarTurno(text, estadoRef.current);
      estadoRef.current = estado;
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), text: resultado.texto, sender: 'bot', time: agora() },
      ]);
    } catch {
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
      >
        <ScrollView className="flex-1 px-4 py-2">
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`my-1.5 max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'self-end bg-sky-700 rounded-br-none'
                  : 'self-start bg-sky-100 rounded-bl-none'
              }`}
            >
              <Text className={msg.sender === 'user' ? 'text-white' : 'text-slate-800'}>
                {msg.text}
              </Text>
              <Text
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-sky-200' : 'text-gray-500'
                }`}
              >
                {msg.time}
              </Text>
            </View>
          ))}
        </ScrollView>

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

        <View className="flex-row items-center p-3 gap-2">
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
          >
            <Ionicons name="send" size={20} color="#0284c7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
