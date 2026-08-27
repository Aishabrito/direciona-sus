import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
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
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { salvarPerfil } = useApp();

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

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', { email, senha });
      router.replace('/boas-vindas');
    } else {
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem');
        return;
      }
      console.log('Cadastro:', { nome, email, senha });
      salvarPerfil({ idade: null, gestante: 'nao_informado' });
      router.replace('/boas-vindas');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f4f8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER COM GRADIENTE + ONDAS */}
        <LinearGradient
          colors={['#142e66', '#3380b2', '#59d9d1']}
          style={{
            height: 280,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 40,
            overflow: 'hidden',
          }}
        >
          <Svg
            width="100%"
            height="140"
            viewBox="0 0 400 140"
            style={{ position: 'absolute', bottom: 0, left: 0 }}
          >
            <Path
              d="M0 90 Q 100 60, 200 88 T 400 82"
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.5}
              opacity={0.35}
            />
            <Path
              d="M0 100 Q 100 75, 200 98 T 400 92"
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.5}
              opacity={0.25}
            />
            <Path
              d="M0 110 Q 100 92, 200 106 T 400 100"
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.5}
              opacity={0.18}
            />
            <Path
              d="M0 120 Q 100 105, 200 115 T 400 110"
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.5}
              opacity={0.12}
            />
          </Svg>

          <Image
            source={require('../assets/logopura.png')}
            style={{ width: 176, height: 176, marginTop: 24 }}
            resizeMode="contain"
          />
        </LinearGradient>

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
                      colors={['#142e66', '#3380b2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.switcherActive, styles.softShadow]}
                    >
                      <Text className="text-white font-bold text-sm">
                        {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text className="text-slate-500 font-semibold text-sm">
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
                  className="flex-1 ml-3 text-slate-600 font-medium text-[15px]"
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
                className="flex-1 ml-3 text-slate-600 font-medium text-[15px]"
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
                className="flex-1 ml-3 text-slate-600 font-medium text-[15px]"
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
                  className="flex-1 ml-3 text-slate-600 font-medium text-[15px]"
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
              <Text className="text-[#3380b2] font-semibold text-[13px]">
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
              colors={['#142e66', '#3380b2', '#3ea8c0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainButtonGradient}
            >
              <Text className="text-white font-bold text-base tracking-widest">
                {tituloBotao}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* DIVISOR */}
          <View className="flex-row items-center justify-center gap-3.5 mt-6">
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
            <Text className="text-slate-400 font-medium text-xs">
              {isLogin ? 'Ou entrar com:' : 'Ou cadastrar com:'}
            </Text>
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
          </View>

          {/* BOTÕES SOCIAIS */}
          <View className="flex-row justify-center gap-5 mt-3">
            <TouchableOpacity
              style={[styles.socialButton, styles.softShadow]}
              onPress={() => console.log('Google')}
            >
              <Text className="text-slate-700 font-bold text-lg">G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.softShadow]}
              onPress={() => console.log('Apple')}
            >
              <Ionicons name="logo-apple" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* RODAPÉ - ALTERNÂNCIA DE MODO */}
          <TouchableOpacity
            className="mt-4 items-center py-2"
            onPress={() => setMode(isLogin ? 'signup' : 'login')}
          >
            <Text className="text-slate-500 text-sm font-medium">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
              <Text className="text-[#3380b2] font-bold underline">
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
      shadowColor: '#142e66',
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