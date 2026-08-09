import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente do Direciona SUS. Estou aqui para orientar você sobre os serviços de saúde disponíveis. Como posso ajudar?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Sugestões de botões rápidos
  const suggestions = [
    'UBS mais próxima',
    'Agendar consulta',
    'Urgência',
    'Vacinação',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Adiciona mensagem do usuário
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Resposta automática do Bot (Simulação)
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Entendi! Você selecionou/digitou: "${text}". Em breve conectaremos ao serviço correto do SUS.`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-400">
      {/* Cabeçalho */}
      <View className="flex-row items-center px-4 py-3 bg-sky-600">
        <View className="w-10 h-10 rounded-full bg-sky-200 items-center justify-center mr-3">
          <Ionicons name="shield-checkmark" size={24} color="#0284c7" />
        </View>
        <View>
          <Text className="text-white text-lg font-bold">Direciona SUS</Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-400 mr-1.5" />
            <Text className="text-sky-100 text-xs">Online agora</Text>
          </View>
        </View>
      </View>

      {/* Lista de Mensagens */}
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

      {/* Botões de Sugestão (Quick Replies) */}
      <View className="flex-row flex-wrap justify-center gap-2 px-3 py-2">
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSend(item)}
            className="bg-sky-800/60 px-4 py-2 rounded-full border border-sky-300/30"
          >
            <Text className="text-white font-medium text-xs">{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input de Mensagem */}
      <View className="flex-row items-center p-3 gap-2">
        <View className="flex-1 flex-row items-center bg-sky-100/40 rounded-full px-4 py-2">
          <TextInput
            placeholder="Mensagem..."
            placeholderTextColor="#e0f2fe"
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 text-white pr-2"
          />
          <TouchableOpacity>
            <Ionicons name="happy-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSend()}
          className="w-12 h-12 bg-sky-200 rounded-full items-center justify-center"
        >
          <Ionicons name={inputText.trim() ? "send" : "mic"} size={20} color="#0284c7" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}