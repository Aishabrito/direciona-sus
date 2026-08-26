import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientScreen } from '../components/GradientScreen';

export default function OnboardingBoasVindas() {
  const router = useRouter();

  return (
    <GradientScreen className="justify-between p-6">
      <Text className="text-white text-lg font-serif">DirecionaSus</Text>

      <View className="items-center">
        <View className="bg-sky-100 w-full h-64 rounded-2xl items-center justify-center p-4 mb-8">
          <Text className="text-sky-900 text-center font-medium">[ Ilustração Ilustrativa Guias ]</Text>
        </View>

        <View className="w-full">
          <Text className="text-white text-2xl font-serif mb-2">Seu guia rápido no SUS</Text>
          <Text className="text-sky-100 text-sm leading-5">
            Encontre pontos de saúde, tire dúvidas e descubra o local ideal para o seu atendimento em poucos cliques.
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-row">
          <View className="w-6 h-2 bg-white rounded-full mr-1.5" />
          <View className="w-2 h-2 bg-sky-300 rounded-full mr-1.5" />
          <View className="w-2 h-2 bg-sky-300 rounded-full" />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/direcionamento')}
          className="bg-sky-900 px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Próximo</Text>
        </TouchableOpacity>
      </View>
    </GradientScreen>
  );
}
