import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientScreen } from '../components/GradientScreen';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <GradientScreen className="justify-between p-6">
      <View className="flex-1 justify-center">
        <Text className="text-white text-4xl font-serif text-center mb-12">DirecionaSus</Text>

        <View className="mb-6">
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#93c5fd"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border-b border-sky-200 text-white py-2 px-1 text-base"
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#93c5fd"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            className="border-b border-sky-200 text-white py-2 px-1 text-base mt-4"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/boas-vindas')}
          className="bg-sky-900 py-3.5 rounded-full items-center mb-4 mt-6"
        >
          <Text className="text-white font-bold tracking-widest text-sm">ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-sky-100 text-xs">
            Esqueceu seus dados de login? <Text className="underline font-bold">Recupere sua senha</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/cadastro')} className="items-center pb-4">
        <Text className="text-white text-xs">
          Não tem uma conta? <Text className="font-bold underline">Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </GradientScreen>
  );
}
