import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  /** cor do "Direciona"; o ".Ai" fica sempre em verde-água */
  color?: string;
};

// Logo do Figma: o "D" com a bússola e o nome "Direciona.Ai" logo abaixo.
export function Logo({ size = 150, color = '#142e66' }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logopura.png')}
        style={{ width: size * 1.15, height: size * 1.15 * (353 / 482) }}
        resizeMode="contain"
      />
      <Text style={[styles.nome, { fontSize: size * 0.21, color }]}>
        Direciona<Text style={styles.ai}>.Ai</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  nome: { fontWeight: '800', marginTop: 4, letterSpacing: 0.3 },
  ai: { color: '#0e9488' },
});
