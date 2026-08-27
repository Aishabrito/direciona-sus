import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0b3b5c', '#0284c7', '#5eead4']}
      className="flex-1 items-center justify-center"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image
        source={require('../assets/logo.png')}
        className="w-48 h-48"
        resizeMode="contain"
      />
      <Text className="text-white text-3xl font-bold mt-4 tracking-widest">
        Direciona SUS
      </Text>
      <Text className="text-sky-200 text-sm mt-2 tracking-widest">
        Acesso facilitado à saúde
      </Text>
    </LinearGradient>
  );
}