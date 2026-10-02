import Svg, { Path } from 'react-native-svg';

// Linhas de "ondas" usadas no rodapé dos cabeçalhos com gradiente (padrão do Figma).
export function Waves({ height = 140, opacity = 1 }: { height?: number; opacity?: number }) {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 400 140"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 0, left: 0, opacity }}
    >
      <Path d="M0 90 Q 100 60, 200 88 T 400 82" fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.35} />
      <Path d="M0 100 Q 100 75, 200 98 T 400 92" fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.25} />
      <Path d="M0 110 Q 100 92, 200 106 T 400 100" fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.18} />
      <Path d="M0 120 Q 100 105, 200 115 T 400 110" fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.12} />
    </Svg>
  );
}
