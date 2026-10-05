import { Platform } from 'react-native';

// Identidade visual do Direciona.Ai (cores tiradas do logo).
export const COR = {
  azul: '#034268', // "Direciona" e o D
  azulMedio: '#0a5c7d',
  verde: '#14bc9a', // ".Ai" e a rosa dos ventos
  verdeEscuro: '#0e9a80',
  fundo: '#f7f9fb', // off-white dos posts
  binario: '#ebeff3', // números do fundo
  texto: '#1d3b53',
  textoSuave: '#5b6f80',
  borda: '#dde5ec',
  branco: '#ffffff',
};

// Degradê do logo: azul → verde.
export const DEGRADE = [COR.azul, COR.azulMedio, COR.verde] as const;

// Nunito (arredondada, parecida com o nome no logo) + serifada nas frases de destaque.
export const FONTE = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }) as string,
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
};
