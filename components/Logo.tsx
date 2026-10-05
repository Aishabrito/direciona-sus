import { Image } from 'react-native';

type Props = {
  /** largura em pontos */
  largura?: number;
  /** 'completo' = D + "Direciona.Ai"; 'icone' = só o D */
  tipo?: 'completo' | 'icone';
};

const ARQUIVOS = {
  completo: { fonte: require('../assets/logo-direciona-ai.png'), proporcao: 658 / 993 },
  icone: { fonte: require('../assets/logo-icone.png'), proporcao: 473 / 479 },
};

export function Logo({ largura = 220, tipo = 'completo' }: Props) {
  const { fonte, proporcao } = ARQUIVOS[tipo];
  return (
    <Image
      source={fonte}
      style={{ width: largura, height: largura * proporcao }}
      resizeMode="contain"
      accessibilityLabel="Direciona.Ai"
    />
  );
}
