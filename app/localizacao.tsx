import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradientScreen } from '../components/GradientScreen';

export default function LocalizacaoScreen() {
  const router = useRouter();
  const { salvarLocalizacao } = useApp();
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState('');

  const handleSalvar = async () => {
    await salvarLocalizacao({ bairro, municipio });
    router.push('/chat');
  };

  return (
    <GradientScreen className="justify-between p-6">
      <Text className="text-white text-lg font-serif">DirecionaSus</Text>
      <View className="flex-1 justify-center">
        <Text className="text-white text-2xl font-serif mb-6">Onde você está?</Text>
        <TextInput
          placeholder="Bairro"
          placeholderTextColor="#93c5fd"
          value={bairro}
          onChangeText={setBairro}
          className="border-b border-sky-200 text-white py-2 px-1 text-base mb-4"
        />
        <TextInput
          placeholder="Município"
          placeholderTextColor="#93c5fd"
          value={municipio}
          onChangeText={setMunicipio}
          className="border-b border-sky-200 text-white py-2 px-1 text-base mb-6"
        />
        <TouchableOpacity
          onPress={handleSalvar}
          className="bg-sky-900 py-3.5 rounded-full items-center"
        >
          <Text className="text-white font-bold tracking-widest text-sm">CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </GradientScreen>
  );
}