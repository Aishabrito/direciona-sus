import '../global.css';
import { Stack } from 'expo-router';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { COR } from '../constants/tema';

export default function Layout() {
  const [fontesProntas, erroFontes] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Espera as fontes (ou segue com a do sistema se falharem) para não piscar o texto.
  if (!fontesProntas && !erroFontes) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COR.fundo } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="boas-vindas" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
