import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GuiaIllustration,
  TriagemIllustration,
  DirecionamentoIllustration,
} from '../components/OnboardingIllustrations';
import { FundoBinario } from '../components/FundoBinario';
import { Logo } from '../components/Logo';
import { COR, DEGRADE, FONTE } from '../constants/tema';

// Telas de apresentação do app (Figma: onboarding em 3 passos).
const PAGINAS = [
  {
    titulo: 'Seu guia rápido no SUS',
    texto:
      'Encontre postos de saúde, tire dúvidas e descubra o local ideal para o seu atendimento em poucos cliques.',
    Ilustracao: GuiaIllustration,
  },
  {
    titulo: 'Triagem Simples e Rápida',
    texto:
      'Converse com nosso assistente virtual pelo próprio app ou via WhatsApp. Relate seus sintomas como se estivesse falando com um amigo, e nós faremos uma avaliação inicial segura.',
    Ilustracao: TriagemIllustration,
  },
  {
    titulo: 'Direcionamento Preciso',
    texto:
      'Sem perda de tempo ou viagens desnecessárias. Saiba exatamente onde buscar ajuda, seja na Clínica da Família, UPA ou emergência mais adequada para o seu caso.',
    Ilustracao: DirecionamentoIllustration,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [pagina, setPagina] = useState(0);
  const ultima = pagina === PAGINAS.length - 1;

  const aoRolar = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPagina(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const avancar = () => {
    if (ultima) {
      router.replace('/chat');
      return;
    }
    const proxima = pagina + 1;
    scrollRef.current?.scrollTo({ x: proxima * width, animated: true });
    setPagina(proxima);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FundoBinario />
      <SafeAreaView style={styles.container}>
        <View style={styles.marca}>
          <Logo largura={120} />
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={aoRolar}
          scrollEventThrottle={16}
          style={styles.container}
        >
          {PAGINAS.map(({ titulo, texto, Ilustracao }) => (
            <View key={titulo} style={[styles.pagina, { width }]}>
              <LinearGradient colors={['#ffffff', '#dcf4ee']} style={styles.cartao}>
                <Ilustracao />
              </LinearGradient>
              <Text style={styles.titulo}>{titulo}</Text>
              <Text style={styles.texto}>{texto}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.rodape}>
          <View style={styles.dots}>
            {PAGINAS.map((p, i) => (
              <View key={p.titulo} style={[styles.dot, i === pagina && styles.dotAtivo]} />
            ))}
          </View>
          <TouchableOpacity onPress={avancar} activeOpacity={0.8} style={styles.botaoSombra}>
            <LinearGradient colors={DEGRADE} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.botao}>
              <Text style={styles.botaoTexto}>{ultima ? 'Começar a usar' : 'Próximo'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  marca: { paddingHorizontal: 24, paddingTop: 12, alignItems: 'flex-start' },
  pagina: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  cartao: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COR.borda,
  },
  titulo: {
    fontFamily: FONTE.extrabold,
    color: COR.azul,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 12,
  },
  texto: { fontFamily: FONTE.regular, color: COR.textoSuave, fontSize: 16, lineHeight: 24 },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COR.borda },
  dotAtivo: { width: 24, backgroundColor: COR.verde },
  botaoSombra: {
    borderRadius: 26,
    shadowColor: COR.azul,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  botao: { borderRadius: 26, paddingVertical: 14, paddingHorizontal: 28 },
  botaoTexto: { fontFamily: FONTE.extrabold, color: COR.branco, fontSize: 16 },
});
