import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingBoasVindas() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0b3b5c', '#0284c7']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView className="flex-1 justify-between px-6 py-4">
        {/* Cabeçalho com logo e título */}
        <View className="items-center mt-4">
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text className="text-white text-3xl font-bold mt-2 tracking-wide">
            Direciona SUS
          </Text>
          <Text className="text-sky-200 text-sm mt-1">
            Seu guia inteligente na rede pública
          </Text>
        </View>

        {/* Corpo: ilustração + descrição */}
        <View className="flex-1 justify-center items-center px-2">
          <View className="bg-white/10 rounded-3xl p-6 w-full backdrop-blur-sm">
            <Text className="text-white text-2xl font-bold text-center mb-3">
              🏥 Encontre o atendimento certo
            </Text>
            <Text className="text-sky-100 text-base text-center leading-6">
              Descubra para onde ir com base nos seus sintomas, com orientações claras e seguras.
            </Text>
          </View>
        </View>

        {/* Rodapé com botão */}
        <View className="items-center pb-6">
          <TouchableOpacity
            onPress={() => router.push('/direcionamento')}
            className="bg-white py-4 px-12 rounded-full shadow-lg active:opacity-80"
          >
            <Text className="text-sky-800 font-bold text-base tracking-wide">
              Começar →
            </Text>
          </TouchableOpacity>

          {/* Indicadores de página (opcional) */}
          <View className="flex-row mt-6">
            <View className="w-8 h-2 bg-white rounded-full mr-2" />
            <View className="w-2 h-2 bg-sky-300 rounded-full mr-2" />
            <View className="w-2 h-2 bg-sky-300 rounded-full" />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}