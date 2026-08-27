import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PerfilUsuario = {
  idade: number | null;
  gestante: 'sim' | 'nao' | 'nao_informado';
  bairro: string;
  municipio: string;
};

type AppContextType = {
  perfil: PerfilUsuario;
  salvarPerfil: (dados: Partial<PerfilUsuario>) => Promise<void>;
  localizacao: { bairro: string; municipio: string };
  salvarLocalizacao: (dados: { bairro: string; municipio: string }) => Promise<void>;
};

const defaultPerfil: PerfilUsuario = {
  idade: null,
  gestante: 'nao_informado',
  bairro: '',
  municipio: '',
};

const AppContext = createContext<AppContextType>({
  perfil: defaultPerfil,
  salvarPerfil: async () => {},
  localizacao: { bairro: '', municipio: '' },
  salvarLocalizacao: async () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilUsuario>(defaultPerfil);
  const [localizacao, setLocalizacao] = useState({ bairro: '', municipio: '' });

  useEffect(() => {
    // Carregar dados salvos ao iniciar
    const carregarDados = async () => {
      try {
        const perfilSalvo = await AsyncStorage.getItem('@perfil');
        if (perfilSalvo) setPerfil(JSON.parse(perfilSalvo));
        const localSalvo = await AsyncStorage.getItem('@localizacao');
        if (localSalvo) setLocalizacao(JSON.parse(localSalvo));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDados();
  }, []);

  const salvarPerfil = async (dados: Partial<PerfilUsuario>) => {
    const novoPerfil = { ...perfil, ...dados };
    setPerfil(novoPerfil);
    await AsyncStorage.setItem('@perfil', JSON.stringify(novoPerfil));
  };

  const salvarLocalizacao = async (dados: { bairro: string; municipio: string }) => {
    const novaLocal = { ...localizacao, ...dados };
    setLocalizacao(novaLocal);
    await AsyncStorage.setItem('@localizacao', JSON.stringify(novaLocal));
  };

  return (
    <AppContext.Provider value={{ perfil, salvarPerfil, localizacao, salvarLocalizacao }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);