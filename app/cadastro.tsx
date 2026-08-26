import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientScreen } from '../components/GradientScreen';

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <GradientScreen className="justify-between p-6">
      <View className="flex-1 justify-center">
        <Text className="text-white text-4xl font-serif text-center mb-10">DirecionaSus</Text>

        <View className="mb-6">
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#93c5fd"
            value={nome}
            onChangeText={setNome}
            className="border-b border-sky-200 text-white py-2 px-1 text-base"
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#93c5fd"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border-b border-sky-200 text-white py-2 px-1 text-base mt-2"
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#93c5fd"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            className="border-b border-sky-200 text-white py-2 px-1 text-base mt-2"
          />
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#93c5fd"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            className="border-b border-sky-200 text-white py-2 px-1 text-base mt-2"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/boas-vindas')}
          className="bg-sky-900 py-3.5 rounded-full items-center mt-6"
        >
          <Text className="text-white font-bold tracking-widest text-sm">CRIAR CONTA</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/login')} className="items-center pb-4">
        <Text className="text-white text-xs">
          Já possui uma conta? <Text className="font-bold underline">Faça login</Text>
        </Text>
      </TouchableOpacity>
    </GradientScreen>
  );
}
