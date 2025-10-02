import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { biometricAuthService } from '../services/biometricAuth';
import PsiqueButton from './ui/PsiqueButton';
import GradientCard from './ui/GradientCard';
import { showAlert } from '../hooks/useAuth';

interface BiometricSetupProps {
  email: string;
  password: string;
  onComplete: (biometricEnabled: boolean) => void;
  onSkip: () => void;
}

export default function BiometricSetup({ email, password, onComplete, onSkip }: BiometricSetupProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [supportedTypes, setSupportedTypes] = useState(['Face ID', 'Touch ID']);
  
  // Animations
  const iconScale = useSharedValue(1);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  React.useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardTranslateY.value = withSpring(0);
    
    // Check availability
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await biometricAuthService.isAvailable();
      const types = await biometricAuthService.getSupportedTypes();
      setIsAvailable(available);
      setSupportedTypes(types);
    } catch (error) {
      console.log('Biometric check error:', error);
      setIsAvailable(false);
    }
  };

  const animateIcon = () => {
    iconScale.value = withSequence(
      withSpring(1.2, { duration: 200 }),
      withSpring(1, { duration: 200 })
    );
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const handleEnableBiometric = async () => {
    if (!isAvailable) {
      showAlert('Biometria não disponível', 'Seu dispositivo não suporta autenticação biométrica.');
      onComplete(false);
      return;
    }

    setLoading(true);
    animateIcon();
    
    try {
      // Test authentication first
      const authSuccess = await biometricAuthService.authenticate(
        'Confirme sua identidade para ativar o login biométrico'
      );

      if (!authSuccess) {
        showAlert('Cancelado', 'Configuração de biometria cancelada.');
        setLoading(false);
        return;
      }

      // Save credentials securely
      await biometricAuthService.saveCredentials(email, password);
      await biometricAuthService.setBiometricEnabled(true);
      
      showAlert(
        '🔐 Login Biométrico Ativado!',
        `Agora você pode fazer login usando ${supportedTypes.join(' ou ')}. Suas credenciais estão protegidas de forma segura.`
      );
      
      onComplete(true);
    } catch (error) {
      console.error('Biometric setup error:', error);
      showAlert('Erro', 'Não foi possível ativar o login biométrico. Tente novamente.');
      onComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onComplete(false);
  };

  const getBiometricIcon = () => {
    if (supportedTypes.includes('Reconhecimento Facial')) {
      return 'face';
    } else if (supportedTypes.includes('Impressão Digital')) {
      return 'fingerprint';
    }
    return 'security';
  };

  const getBiometricTitle = () => {
    if (supportedTypes.length > 1) {
      return 'Ativar Login Biométrico';
    } else if (supportedTypes.includes('Reconhecimento Facial')) {
      return 'Ativar Face ID';
    } else if (supportedTypes.includes('Impressão Digital')) {
      return 'Ativar Touch ID';
    }
    return 'Ativar Biometria';
  };

  const getBiometricDescription = () => {
    const types = supportedTypes.join(' ou ');
    return `Use ${types} para fazer login rapidamente no PsiqueIA. Suas credenciais ficam protegidas com criptografia avançada.`;
  };

  React.useEffect(() => {
    if (!isAvailable) {
      const timer = setTimeout(() => onComplete(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAvailable, onComplete]);

  if (!isAvailable) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#0A0E1A', '#1A1A2E', '#16213E']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        <Animated.View style={[cardAnimatedStyle]}>
          <GradientCard style={styles.setupCard}>
            <View style={styles.cardContent}>
              {/* Icon */}
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <LinearGradient
                  colors={['#00E5FF', '#7B68EE']}
                  style={styles.iconGradient}
                >
                  <MaterialIcons name={getBiometricIcon() as any} size={48} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>

              {/* Title */}
              <Text style={styles.title}>{getBiometricTitle()}</Text>

              {/* Description */}
              <Text style={styles.description}>
                {getBiometricDescription()}
              </Text>

              {/* Features */}
              <View style={styles.features}>
                <View style={styles.feature}>
                  <MaterialIcons name="speed" size={20} color="#00E5FF" />
                  <Text style={styles.featureText}>Login instantâneo</Text>
                </View>
                <View style={styles.feature}>
                  <MaterialIcons name="security" size={20} color="#7B68EE" />
                  <Text style={styles.featureText}>Máxima segurança</Text>
                </View>
                <View style={styles.feature}>
                  <MaterialIcons name="privacy-tip" size={20} color="#20B2AA" />
                  <Text style={styles.featureText}>Dados criptografados</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttons}>
                <PsiqueButton
                  title={loading ? "Configurando..." : "Ativar Biometria"}
                  onPress={handleEnableBiometric}
                  disabled={loading}
                  style={styles.enableButton}
                />
                
                <TouchableOpacity 
                  onPress={handleSkip}
                  style={styles.skipButton}
                  disabled={loading}
                >
                  <Text style={styles.skipButtonText}>Pular por agora</Text>
                </TouchableOpacity>
              </View>

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#00E5FF" />
                  <Text style={styles.loadingText}>
                    Configurando autenticação biométrica...
                  </Text>
                </View>
              )}
            </View>
          </GradientCard>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  setupCard: {
    width: '100%',
    maxWidth: 400,
  },
  cardContent: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  enableButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#7B68EE',
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#7B68EE',
  },
});