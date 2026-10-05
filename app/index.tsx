import { useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../components/Logo';
import { FundoBinario } from '../components/FundoBinario';
import { COR, FONTE } from '../constants/tema';

// Tela de abertura, no estilo dos posts: fundo claro com binários, logo e a frase.
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FundoBinario />
      <Logo largura={250} />
      <Text style={styles.frase}>
        Inteligência Artificial e informação para facilitar o seu acesso à saúde pública.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  frase: {
    fontFamily: FONTE.serif,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: COR.azul,
    textAlign: 'center',
    marginTop: 40,
  },
});
