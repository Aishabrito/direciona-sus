import '../global.css';
import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="boas-vindas" />
        <Stack.Screen name="localizacao" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="direcionamento" />
      </Stack>
    </AppProvider>
  );
}