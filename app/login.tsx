import { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
      // Lógica de login
      console.log('Login:', { email, senha });
      // Após login, vá para boas-vindas
      router.replace('/boas-vindas');
    } else {
      // Lógica de cadastro
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem');
        return;
      }
      console.log('Cadastro:', { nome, email, senha });
      // Salvar nome/email no contexto (opcional)
      salvarPerfil({ idade: null, gestante: 'nao_informado' });
      router.replace('/boas-vindas');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f0f4f8]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com gradiente */}
        <LinearGradient
          colors={['#142e66', '#3380b2', '#59d9d1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 280,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 40,
          }}
        >
          <Text className="text-white text-4xl font-bold font-serif tracking-widest">
            Direciona Saude
          </Text>
          <Text className="text-sky-200 text-sm mt-1 tracking-widest">
            Acesso facilitado à saúde
          </Text>
        </LinearGradient>

        {/* Conteúdo do formulário */}
        <View className="flex-1 px-7 pt-7 pb-5">
          {/* Alternador login/cadastro */}
          <View className="flex-row h-[54px] bg-[#e8eef5] rounded-[27px] p-1 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-1px_-1px_4px_rgba(255,255,255,0.5)]">
            {(['login', 'signup'] as AuthMode[]).map((modo) => {
              const ativo = mode === modo;
              return (
                <TouchableOpacity
                  key={modo}
                  className={`flex-1 items-center justify-center rounded-[23px] ${
                    ativo ? 'bg-[linear-gradient(90deg,#142e66,#3380b2)] shadow-md' : ''
                  }`}
                  onPress={() => setMode(modo)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={
                      ativo
                        ? 'text-white font-bold text-sm'
                        : 'text-slate-500 font-semibold text-sm'
                    }
                  >
                    {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Campos do formulário */}
          <View className="mt-5 gap-3.5">
            {/* Nome completo (apenas no cadastro) */}
            {mode === 'signup' && (
              <View className="flex-row items-center h-14 bg-[#edf1f7] rounded-[18px] border-[1.5px] border-white px-4 shadow-[inset_3px_3px_6px_rgba(178,189,204,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
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

            {/* Email */}
            <View className="flex-row items-center h-14 bg-[#edf1f7] rounded-[18px] border-[1.5px] border-white px-4 shadow-[inset_3px_3px_6px_rgba(178,189,204,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
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

            {/* Senha */}
            <View className="flex-row items-center h-14 bg-[#edf1f7] rounded-[18px] border-[1.5px] border-white px-4 shadow-[inset_3px_3px_6px_rgba(178,189,204,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
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

            {/* Confirmar senha (apenas cadastro) */}
            {mode === 'signup' && (
              <View className="flex-row items-center h-14 bg-[#edf1f7] rounded-[18px] border-[1.5px] border-white px-4 shadow-[inset_3px_3px_6px_rgba(178,189,204,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
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

          {/* Esqueceu a senha (apenas login) */}
          {isLogin && (
            <TouchableOpacity className="self-end mt-1.5" onPress={() => {}}>
              <Text className="text-[#3380b2] font-semibold text-[13px]">
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          )}

          {/* Botão principal */}
          <TouchableOpacity
            className="h-14 rounded-[28px] mt-6 items-center justify-center shadow-[0px_8px_20px_rgba(20,46,102,0.31)]"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#142e66', '#3380b2', '#3ea8c0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-white font-bold text-base tracking-widest">
                {tituloBotao}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divisor com "Ou entrar com:" */}
          <View className="flex-row items-center justify-center gap-3.5 mt-6">
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
            <Text className="text-slate-400 font-medium text-xs">
              {isLogin ? 'Ou entrar com:' : 'Ou cadastrar com:'}
            </Text>
            <View className="h-px flex-1 max-w-[70px] bg-slate-300" />
          </View>

          {/* Botões sociais */}
          <View className="flex-row justify-center gap-5 mt-3">
            <TouchableOpacity
              className="w-14 h-14 bg-[#edf1f7] rounded-[28px] border-[1.5px] border-white items-center justify-center shadow-[4px_4px_8px_rgba(178,189,204,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]"
              onPress={() => console.log('Google')}
            >
              <Text className="text-slate-700 font-bold text-lg">G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-14 h-14 bg-[#edf1f7] rounded-[28px] border-[1.5px] border-white items-center justify-center shadow-[4px_4px_8px_rgba(178,189,204,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]"
              onPress={() => console.log('Apple')}
            >
              <Ionicons name="logo-apple" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* Rodapé – indicador de página (apenas visual) */}
          <View className="h-[34px] items-center justify-center mt-4">
            <View className="w-[134px] h-[5px] bg-black/20 rounded-[100px]" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}