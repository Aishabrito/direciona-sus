import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

// Ilustrações das telas de apresentação, recriadas com ícones e formas vetoriais
// a partir do Figma. Para usar as artes originais, exporte-as do Figma em PNG e
// troque cada componente por um <Image source={require('../assets/...')} />.

const NAVY = '#142e66';
const TEAL = '#2fb7b0';
const BLUE = '#3380b2';

// 1. "Seu guia rápido no SUS": pessoa com o celular, cercada de unidade, mapa e prontuário
export function GuiaIllustration() {
  return (
    <View style={styles.fill}>
      <View style={styles.halo}>
        <View style={styles.pessoa}>
          <Ionicons name="person" size={64} color={NAVY} />
          <View style={styles.celular}>
            <Ionicons name="heart" size={18} color={TEAL} />
          </View>
        </View>
      </View>
      <View style={[styles.flutuante, { top: 22, left: 34 }]}>
        <Ionicons name="business" size={30} color={BLUE} />
      </View>
      <View style={[styles.flutuante, { bottom: 40, left: 26 }]}>
        <Ionicons name="location" size={30} color={TEAL} />
      </View>
      <View style={[styles.flutuante, { top: 44, right: 30 }]}>
        <Ionicons name="clipboard" size={30} color={BLUE} />
      </View>
    </View>
  );
}

// 2. "Triagem Simples e Rápida": celular com a conversa
export function TriagemIllustration() {
  return (
    <View style={styles.fill}>
      <View style={styles.phone}>
        <View style={styles.phoneTopo}>
          <View style={styles.phoneAvatar} />
        </View>
        <View style={[styles.bolha, styles.bolhaBot, { width: 64 }]} />
        <View style={[styles.bolha, styles.bolhaUser, { width: 50 }]} />
        <View style={[styles.bolha, styles.bolhaBot, { width: 72 }]} />
        <View style={[styles.bolha, styles.bolhaUser, { width: 40 }]} />
        <View style={[styles.bolha, styles.bolhaBot, { width: 58 }]} />
      </View>
    </View>
  );
}

// 3. "Direcionamento Preciso": mapa com o pino da unidade indicada
export function DirecionamentoIllustration() {
  return (
    <View style={styles.fill}>
      <View style={styles.mapa}>
        <Svg width="100%" height="100%" viewBox="0 0 200 130">
          <Path d="M0 95 L120 40 L200 55" stroke="#d5dde8" strokeWidth={6} fill="none" />
          <Path d="M60 0 L95 130" stroke="#d5dde8" strokeWidth={6} fill="none" />
          <Path d="M140 0 L170 130" stroke="#e3e9f1" strokeWidth={4} fill="none" />
          <Circle cx="38" cy="98" r="5" fill={NAVY} />
          <Circle cx="170" cy="28" r="5" fill={NAVY} />
        </Svg>
      </View>
      <View style={styles.pino}>
        <Ionicons name="location" size={78} color={TEAL} />
      </View>
      <View style={styles.cartao}>
        <View style={styles.cartaoIcone} />
        <View>
          <View style={[styles.linha, { width: 56 }]} />
          <View style={[styles.linha, { width: 38, marginTop: 5 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  halo: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  pessoa: { alignItems: 'center' },
  celular: {
    position: 'absolute', bottom: -6, right: -14, width: 30, height: 44, borderRadius: 7,
    backgroundColor: '#ffffff', borderWidth: 2, borderColor: NAVY, alignItems: 'center', justifyContent: 'center',
  },
  flutuante: {
    position: 'absolute', width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center',
  },

  phone: {
    width: 104, height: 186, borderRadius: 18, backgroundColor: '#ffffff',
    borderWidth: 4, borderColor: '#e6edf4', paddingHorizontal: 9, paddingBottom: 10, gap: 7,
  },
  phoneTopo: {
    height: 30, marginHorizontal: -9, marginBottom: 2, borderTopLeftRadius: 14, borderTopRightRadius: 14,
    backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center',
  },
  phoneAvatar: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ffffff' },
  bolha: { height: 14, borderRadius: 7 },
  bolhaBot: { alignSelf: 'flex-start', backgroundColor: '#dff3f2' },
  bolhaUser: { alignSelf: 'flex-end', backgroundColor: BLUE },

  mapa: {
    width: 200, height: 130, borderRadius: 14, backgroundColor: '#ffffff', overflow: 'hidden',
  },
  pino: { position: 'absolute', top: 18 },
  cartao: {
    position: 'absolute', bottom: 22, right: 34, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 10,
    shadowColor: NAVY, shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cartaoIcone: { width: 18, height: 18, borderRadius: 9, backgroundColor: TEAL },
  linha: { height: 5, borderRadius: 3, backgroundColor: '#cfd8e3' },
});
