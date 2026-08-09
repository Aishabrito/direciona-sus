import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingLocalizacao() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-sky-900 via-sky-600 to-teal-400 justify-between p-6">
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
        <View className="flex-row space-x-1.5">
          <View className="w-2 h-2 bg-sky-300/50 rounded-full" />
          <View className="w-2 h-2 bg-sky-300/50 rounded-full" />
          <View className="w-6 h-2 bg-white rounded-full" />
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/chatbot')}
          className="bg-sky-900 px-6 py-2.5 rounded-full"
        >
          <Text className="text-white font-bold text-xs">Começar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
