import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

function parseParam<T>(param: unknown, fallback: T): T {
  if (typeof param === 'string') {
    try {
      const decoded = decodeURIComponent(param);
      return JSON.parse(decoded);
    } catch {
      return decodeURIComponent(param) as T;
    }
  }
  return fallback;
}

export default function DirecionamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const unidade = parseParam(params.unidade, 'UBS ou Clínica da Família');
  const motivo = parseParam(params.motivo, 'Avaliação médica');
  const acoes = parseParam(params.acoes, 'Procure a unidade mais próxima.');
  const telefone = parseParam(params.telefone, '');

  // Detecção flexível de emergência
  const isEmergencia = ['SAMU', '192', 'Emergência', 'Pronto-Socorro', 'UPA']
    .some(palavra => unidade.includes(palavra));

  const handleLigar = () => {
    if (telefone) {
      Linking.openURL(`tel:${telefone}`);
    } else if (isEmergencia) {
      Linking.openURL('tel:192');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-400">
      <View className="flex-1 px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-sky-800 mb-4">Direcionamento</Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Unidade indicada</Text>
            <Text className="text-lg font-semibold text-sky-900">{unidade}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Motivo</Text>
            <Text className="text-base text-gray-800">{motivo}</Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-500">Orientações</Text>
            <Text className="text-base text-gray-800">{acoes}</Text>
          </View>

          {isEmergencia && (
            <TouchableOpacity
              onPress={handleLigar}
              className="bg-red-600 py-4 rounded-full items-center flex-row justify-center"
            >
              <Ionicons name="call" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Ligar para {telefone || '192'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push('/chat')}
            className="mt-4 bg-sky-100 py-3 rounded-full items-center"
          >
            <Text className="text-sky-800 font-bold">Voltar ao chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}