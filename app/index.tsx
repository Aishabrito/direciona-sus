import { useEffect } from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../components/Logo';
import { Waves } from '../components/Waves';

// Tela de abertura (Figma: "Tela inicial").
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#142e66', '#3380b2', '#59d9d1']}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Waves height={220} />
      <Logo size={190} />
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotAtivo]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', bottom: 48, flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotAtivo: { backgroundColor: '#ffffff' },
});
