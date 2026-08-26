import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function TelaInicial() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center p-6 bg-slate-50">
      <Text className="text-3xl font-bold text-slate-900 mb-3">
        Direciona SUS
      </Text>

      <Text className="text-lg text-center text-slate-600 mb-10 leading-6">
        Saiba o serviço de saúde certo para o seu sintoma de forma rápida e segura.
      </Text>

      <Pressable
        onPress={() => router.push('/login')}
        className="bg-blue-600 py-4 px-8 rounded-xl mb-10"
      >
        <Text className="text-white font-bold text-lg text-center">
          Iniciar Triagem
        </Text>
      </Pressable>

      <Text className="absolute bottom-8 text-sm text-slate-400 text-center">
        Atenção: Este app não fornece diagnósticos médicos.
      </Text>
    </View>
  );
}
