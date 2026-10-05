import { View, Text, StyleSheet } from 'react-native';
import { COR, FONTE } from '../constants/tema';

// Fundo com números binários bem claros, como nos posts do Direciona.Ai.
// Sequência fixa (pseudoaleatória) para não mudar a cada renderização.
const LINHAS = (() => {
  let s = 7;
  const bit = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return (s >> 16) & 1; // bits altos: os baixos do LCG se repetem
  };
  return Array.from({ length: 40 }, () =>
    Array.from({ length: 8 }, () => Array.from({ length: 8 }, bit).join('')).join('  ')
  );
})();

export function FundoBinario({ cor = COR.fundo }: { cor?: string }) {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: cor, overflow: 'hidden' }]} pointerEvents="none">
      {LINHAS.map((linha, i) => (
        <Text key={i} numberOfLines={1} ellipsizeMode="clip" style={[styles.linha, { marginLeft: i % 2 ? -18 : -4 }]}>
          {linha}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    fontFamily: FONTE.mono,
    fontSize: 19,
    lineHeight: 30,
    letterSpacing: 1,
    color: COR.binario,
    width: 1200,
  },
});
