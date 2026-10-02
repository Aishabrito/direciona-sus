import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
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

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

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
    <LinearGradient
      colors={['#142e66', '#2a6a9f', '#59d9d1']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.marca}>Direciona ai</Text>

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
              <LinearGradient colors={['#e3f8f8', '#a9e3e8']} style={styles.cartao}>
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
          <TouchableOpacity style={styles.botao} onPress={avancar} activeOpacity={0.8}>
            <Text style={styles.botaoTexto}>{ultima ? 'Começar a usar' : 'Próximo'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  marca: {
    fontFamily: SERIF,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  pagina: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  cartao: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  titulo: {
    fontFamily: SERIF,
    fontWeight: '700',
    color: '#ffffff',
    fontSize: 27,
    lineHeight: 33,
    marginBottom: 12,
  },
  texto: { color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 22 },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotAtivo: { width: 22, backgroundColor: '#ffffff' },
  botao: {
    backgroundColor: '#1d4a6b',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  botaoTexto: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
