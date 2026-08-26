import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="boas-vindas" />
      <Stack.Screen name="direcionamento" />
      <Stack.Screen name="localizacao" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}
