import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import PsiqueButton from './ui/PsiqueButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingScreenProps {
  userType: 'patient' | 'psychologist';
  onComplete: () => void;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  gradient: string[];
}

export default function OnboardingScreen({ userType, onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const commonSlides: SlideData[] = [
    {
      id: 0,
      title: '✨ Bem-vindo ao PsiqueIA',
      subtitle: 'Transformando mentes com inteligência',
      description: 'Uma plataforma completa que combina tecnologia avançada com cuidado humano para revolucionar a saúde mental. Sua jornada de bem-estar começa aqui.',
      color: '#00E5FF',
      icon: 'psychology',
      gradient: ['#00E5FF', '#7B68EE'],
    },
  ];

  const patientSlides: SlideData[] = [
    {
      id: 1,
      title: '📱 Sua Jornada Pessoal',
      subtitle: 'Acompanhamento individualizado',
      description: 'Registre seu humor diário, acompanhe seu progresso terapêutico e tenha insights personalizados sobre sua saúde mental com nosso diário inteligente e ferramentas de bem-estar.',
      color: '#7B68EE',
      icon: 'favorite',
      gradient: ['#7B68EE', '#20B2AA'],
    },
    {
      id: 2,
      title: '🎥 Sessões Virtuais Seguras',
      subtitle: 'Terapia quando e onde precisar',
      description: 'Conecte-se com psicólogos qualificados através de videochamadas criptografadas, no conforto da sua casa. Agendamento flexível e atendimento humanizado.',
      color: '#20B2AA',
      icon: 'video-call',
      gradient: ['#20B2AA', '#00E5FF'],
    },
    {
      id: 3,
      title: '🧘 Ferramentas de Bem-estar 24h',
      subtitle: 'Exercícios e técnicas sempre disponíveis',
      description: 'Acesse meditações guiadas, exercícios de respiração, técnicas de mindfulness e muito mais. Suporte contínuo para sua saúde mental, disponível a qualquer momento.',
      color: '#FFD700',
      icon: 'self-improvement',
      gradient: ['#FFD700', '#FF6B9D'],
    },
  ];

  const psychologistSlides: SlideData[] = [
    {
      id: 1,
      title: '💼 Gestão Profissional Completa',
      subtitle: 'Organize sua prática clínica',
      description: 'Gerencie pacientes, agende sessões, acompanhe o progresso de cada caso e mantenha prontuários organizados em uma plataforma integrada, segura e intuitiva.',
      color: '#7B68EE',
      icon: 'business-center',
      gradient: ['#7B68EE', '#20B2AA'],
    },
    {
      id: 2,
      title: '📊 Análises Inteligentes com IA',
      subtitle: 'Insights baseados em evidências',
      description: 'Receba análises automáticas do progresso dos pacientes, sugestões terapêuticas baseadas em evidências científicas e relatórios detalhados para otimizar seu atendimento.',
      color: '#20B2AA',
      icon: 'analytics',
      gradient: ['#20B2AA', '#00E5FF'],
    },
    {
      id: 3,
      title: '💰 Gestão Financeira Inteligente',
      subtitle: 'Controle completo do negócio',
      description: 'Monitore receitas, gerencie pagamentos automaticamente, tenha relatórios financeiros detalhados e cobrança automatizada. Foque no que importa: cuidar dos seus pacientes.',
      color: '#FFD700',
      icon: 'account-balance-wallet',
      gradient: ['#FFD700', '#FF6B9D'],
    },
  ];

  const finalSlides: SlideData[] = [
    {
      id: 4,
      title: '🤝 Comunidade Conectada',
      subtitle: 'Apoio mútuo e crescimento',
      description: 'Participe de grupos de apoio especializados, compartilhe experiências construtivas e encontre uma rede de suporte acolhedora, segura e sempre disponível.',
      color: '#FF6B9D',
      icon: 'groups',
      gradient: ['#FF6B9D', '#7B68EE'],
    },
    {
      id: 5,
      title: '🚀 Pronto para Transformar?',
      subtitle: 'Sua jornada de evolução começa agora',
      description: 'Junte-se a milhares de pessoas que já transformaram suas vidas com o PsiqueIA. Tecnologia de ponta, cuidado humano e resultados comprovados te esperam!',
      color: '#00E5FF',
      icon: 'rocket-launch',
      gradient: ['#00E5FF', '#7B68EE', '#20B2AA'],
    },
  ];

  const slides = [
    ...commonSlides,
    ...(userType === 'patient' ? patientSlides : psychologistSlides),
    ...finalSlides,
  ];

  const AnimatedSlide = ({ slide, index }: { slide: SlideData; index: number }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);
    const scale = useSharedValue(0.8);

    useEffect(() => {
      if (index === currentIndex) {
        opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
        translateY.value = withDelay(200, withSpring(0));
        scale.value = withDelay(400, withSpring(1));
      }
    }, [currentIndex, index]);

    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];
      
      const opacity2 = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );

      const scale2 = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity: opacity.value * opacity2,
        transform: [
          { translateY: translateY.value },
          { scale: scale.value * scale2 },
        ],
      };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => {
      const rotation = interpolate(
        scrollX.value,
        [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ rotate: `${rotation}deg` }],
      };
    });

    return (
      <View style={[styles.slide, { width: screenWidth }]}>
        <LinearGradient
          colors={slide.gradient}
          style={styles.slideGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.slideContent, animatedStyle]}>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <View style={styles.iconBackground}>
                <MaterialIcons name={slide.icon as any} size={64} color="#FFFFFF" />
              </View>
            </Animated.View>

            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>

            {/* Floating Elements */}
            <View style={styles.floatingElements}>
              {[...Array(6)].map((_, i) => (
                <FloatingElement key={i} delay={i * 300} color={slide.color} index={i} />
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  };

  const FloatingElement = ({ delay, color, index }: { delay: number; color: string; index: number }) => {
    const floatY = useSharedValue(0);
    const opacity = useSharedValue(0.6);
    const scale = useSharedValue(1);

    useEffect(() => {
      const animateFloat = () => {
        const distance = 15 + (index * 3);
        floatY.value = withTiming(-distance, { duration: 2000 + index * 200 });
        opacity.value = withTiming(0.2, { duration: 2000 + index * 200 });
        scale.value = withTiming(0.8, { duration: 2000 + index * 200 });
        
        setTimeout(() => {
          floatY.value = withTiming(0, { duration: 2000 + index * 200 });
          opacity.value = withTiming(0.6, { duration: 2000 + index * 200 });
          scale.value = withTiming(1, { duration: 2000 + index * 200 });
        }, 2000 + index * 200);
      };

      const interval = setInterval(animateFloat, 4000 + index * 500);
      setTimeout(animateFloat, delay);

      return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: floatY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    }));

    const positions = [
      { top: '15%', left: '10%' },
      { top: '25%', right: '15%' },
      { top: '65%', left: '8%' },
      { top: '55%', right: '12%' },
      { top: '45%', left: '85%' },
      { top: '75%', right: '80%' },
    ];

    return (
      <Animated.View 
        style={[
          styles.floatingElement, 
          animatedStyle, 
          { backgroundColor: color + '60' },
          positions[index % positions.length]
        ]} 
      />
    );
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * screenWidth,
        animated: true,
      });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * screenWidth,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/9XgCMBWEYMSP5Nq6RviPNc/Imagem_35.jpeg' }}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.userTypeBadge}>
            <MaterialIcons 
              name={userType === 'patient' ? 'person' : 'psychology'} 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.userTypeText}>
              {userType === 'patient' ? 'Paciente' : 'Psicólogo(a)'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <AnimatedSlide key={slide.id} slide={slide} index={index} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
              <MaterialIcons name="arrow-back" size={24} color="#00E5FF" />
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity onPress={goToNext} style={styles.navButton}>
              <Text style={styles.navButtonText}>Próximo</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#00E5FF" />
            </TouchableOpacity>
          ) : (
            <PsiqueButton
              title="🚀 Começar Jornada"
              onPress={onComplete}
              style={styles.startButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  userTypeText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  slideDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    backgroundColor: '#00E5FF',
    width: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    gap: 8,
  },
  navButtonText: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    minWidth: 180,
  },
});