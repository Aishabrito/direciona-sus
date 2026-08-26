import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native';

type GradientScreenProps = {
  children: ReactNode;
  className?: string;
};

export function GradientScreen({ children, className = '' }: GradientScreenProps) {
  return (
    <LinearGradient
      colors={['#0c4a6e', '#0284c7', '#2dd4bf']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className={`flex-1 ${className}`}>{children}</SafeAreaView>
    </LinearGradient>
  );
}
