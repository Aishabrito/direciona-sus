import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* A primeira tela definida aqui será a inicial */}
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="boas-vindas" />
        <Stack.Screen name="onboarding-direcionamento" />
        <Stack.Screen name="localizacao" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="resultado" />
      </Stack>
    </AppProvider>
  );
}