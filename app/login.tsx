import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../components/Logo';
import { FundoBinario } from '../components/FundoBinario';
import { COR, DEGRADE } from '../constants/tema';

type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();

  const [mode, setMode] = useState<AuthMode>(
    params.mode === 'signup' ? 'signup' : 'login'
  );

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';
  const tituloBotao = isLogin ? 'Entrar Agora' : 'Criar Conta';

  // Login e cadastro ainda são só visuais: não há servidor de contas, então
  // qualquer dado leva à apresentação do app. Nunca registrar a senha em log.
  const handleSubmit = () => {
    if (!isLogin && senha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    router.replace('/boas-vindas');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COR.fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <FundoBinario />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO CLARO COM O LOGO (estilo dos posts) */}
        <View style={styles.cabecalho}>
          <Logo largura={220} />
        </View>

        {/* CONTEÚDO DO FORMULÁRIO */}
        <View className="flex-1 px-7 pt-6 pb-5">

          {/* Alternador Entrar / Cadastrar */}
          <View style={styles.switcherTrack}>
            {(['login', 'signup'] as AuthMode[]).map((modo) => {
              const ativo = mode === modo;
              return (
                <TouchableOpacity
                  key={modo}
                  className="flex-1 items-center justify-center rounded-[23px]"
                  onPress={() => setMode(modo)}
                  activeOpacity={0.7}
                >
                  {ativo ? (
                    <LinearGradient
                      colors={[COR.azul, COR.verde]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.switcherActive, styles.softShadow]}
                    >
                      <Text className="text-white font-nunito-bold text-sm">
                        {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text className="text-slate-500 font-nunito text-sm">
                      {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CAMPOS DO FORMULÁRIO */}
          <View className="mt-5 gap-3.5">
            {mode === 'signup' && (
              <View style={styles.inputField}>
                <Ionicons name="person-outline" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-slate-600 font-nunito text-[15px]"
                  placeholder="Nome completo"
                  placeholderTextColor="#94a3b8"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputField}>
              <Ionicons name="mail-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-600 font-nunito text-[15px]"
                placeholder="Seu e-mail"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputField}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-600 font-nunito text-[15px]"
                placeholder="Sua senha"
                placeholderTextColor="#94a3b8"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputField}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-slate-600 font-nunito text-[15px]"
                  placeholder="Confirmar senha"
                  placeholderTextColor="#94a3b8"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            )}
          </View>

          {isLogin && (
            <TouchableOpacity className="self-end mt-1.5" onPress={() => {}}>
              <Text className="text-[#0e9a80] font-nunito text-[13px]">
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          )}

          {/* BOTÃO PRINCIPAL */}
          <TouchableOpacity
            style={[styles.mainButton, styles.mainButtonShadow]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={DEGRADE}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainButtonGradient}
            >
              <Text className="text-white font-nunito-bold text-base tracking-widest">
                {tituloBotao}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* DIVISOR */}
          <View className="flex-row items-center justify-center gap-3.5 mt-6">
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
            <Text className="text-slate-400 font-nunito text-xs">
              {isLogin ? 'Ou entrar com:' : 'Ou cadastrar com:'}
            </Text>
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
          </View>

          {/* BOTÕES SOCIAIS (Google e Apple ainda não implementados) */}
          <View className="flex-row justify-center gap-5 mt-3">
            <TouchableOpacity
              style={[styles.socialButton, styles.softShadow]}
              onPress={() => {}}
            >
              <Text className="text-slate-700 font-nunito-bold text-lg">G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.softShadow]}
              onPress={() => {}}
            >
              <Ionicons name="logo-apple" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* RODAPÉ - ALTERNÂNCIA DE MODO */}
          <TouchableOpacity
            className="mt-4 items-center py-2"
            onPress={() => setMode(isLogin ? 'signup' : 'login')}
          >
            <Text className="text-slate-500 text-sm font-nunito">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
              <Text className="text-[#0e9a80] font-nunito-bold underline">
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* INDICADOR INFERIOR */}
          <View className="h-[34px] items-center justify-center mt-2">
            <View className="w-[134px] h-[5px] bg-black/20 rounded-[100px]" />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Sombras e efeito "afundado" via StyleSheet nativo (funciona igual em iOS/Android,
// diferente de classes arbitrárias tailwind tipo shadow-[inset_...] que não renderizam em RN)
const styles = StyleSheet.create({
  cabecalho: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    overflow: 'hidden',
  },

  // Campos de input: simula profundidade com bordas bicolor
  // (mais escura em cima/esquerda = "sombra entrando", mais clara embaixo/direita = "brilho saindo")
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#edf1f7',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: 'rgba(160,172,194,0.45)',
    borderLeftColor: 'rgba(160,172,194,0.45)',
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.9)',
    borderRightColor: 'rgba(255,255,255,0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#b2bdcc',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  switcherTrack: {
    flexDirection: 'row',
    height: 54,
    backgroundColor: '#e8eef5',
    borderRadius: 27,
    padding: 4,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopColor: 'rgba(160,172,194,0.35)',
    borderLeftColor: 'rgba(160,172,194,0.35)',
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.8)',
    borderRightColor: 'rgba(255,255,255,0.8)',
  },
  switcherActive: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainButton: {
    height: 56,
    borderRadius: 28,
    marginTop: 24,
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonShadow: Platform.select({
    ios: {
      shadowColor: COR.azul,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.31,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) as ViewStyle,

  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: '#edf1f7',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  // sombra externa leve reutilizável (alternador ativo, botões sociais)
  softShadow: Platform.select({
    ios: {
      shadowColor: '#b2bdcc',
      shadowOffset: { width: 2, height: 3 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }) as ViewStyle,
});