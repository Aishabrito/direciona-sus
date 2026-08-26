import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientScreen } from '../components/GradientScreen';

export default function OnboardingLocalizacao() {
  const router = useRouter();

  return (
    <GradientScreen className="justify-between p-6">
      <Text className="text-white text-lg font-serif">DirecionaSus</Text>

      <View className="items-center justify-center flex-1">
        <View className="w-full">
          <Text className="text-white text-2xl font-serif mb-3">
            Encontre unidades próximas
          </Text>
          <Text className="text-sky-100 text-sm leading-5">
            Localize postos de saúde perto de você, consulte horários de funcionamento e veja quais serviços estão disponíveis.
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-row">
          <View className="w-2 h-2 bg-sky-300 rounded-full mr-1.5" />
          <View className="w-2 h-2 bg-sky-300 rounded-full mr-1.5" />
          <View className="w-6 h-2 bg-white rounded-full" />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/chat')}
          className="bg-sky-900 px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Começar</Text>
        </TouchableOpacity>
      </View>
    </GradientScreen>
  );
}
