import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export function GradientScreen({ children, className = '' }: any) {
  return (
    <LinearGradient
      colors={['#0b3b5c', '#0284c7']}
      className={`flex-1 ${className}`}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView className="flex-1">{children}</SafeAreaView>
    </LinearGradient>
  );
}