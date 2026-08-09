import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function TelaInicial() {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-900 mb-3">
        Direciona SUS
      </Text>
      
      <Text className="text-lg text-center text-slate-600 mb-10 leading-6">
        Saiba o serviço de saúde certo para o seu sintoma de forma rápida e segura.
      </Text>
      
      <Link href="/triagem" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg text-center overflow-hidden mb-10">
        Iniciar Triagem
      </Link>

      <Text className="absolute bottom-8 text-sm text-slate-400 text-center">
        Atenção: Este app não fornece diagnósticos médicos.
      </Text>
    </View>
  );
}