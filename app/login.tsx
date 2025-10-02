import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useAuth, showAlert } from '../hooks/useAuth';
import LoadingButton from '../components/ui/LoadingButton';
import BiometricSetup from '../components/BiometricSetup';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const insets = useSafeAreaInsets();
  const { 
    signIn, 
    signUp, 
    loading, 
    user, 
    isBiometricAvailable, 
    isBiometricEnabled,
    tryBiometricLogin 
  } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'psychologist'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{email: string, password: string} | null>(null);
  
  // Animações
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-30);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  // Redirect se já logado
  useEffect(() => {
    if (user) {
      console.log('✅ User logged in, redirecting to dashboard');
      router.replace('/(tabs)');
    }
  }, [user]);

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const available = await isBiometricAvailable();
        const enabled = await isBiometricEnabled();
        setBiometricAvailable(available);
        setBiometricEnabled(enabled);
        console.log('🔐 Biometric status:', { available, enabled });

        // Auto biometric login se disponível e habilitado
        if (available && enabled && !isSignUp) {
          console.log('🔐 Attempting auto biometric login...');
          const success = await tryBiometricLogin();
          if (success) {
            console.log('✅ Auto biometric login successful');
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        console.error('❌ Error checking biometric:', error);
        setBiometricAvailable(false);
        setBiometricEnabled(false);
      }
    };
    
    // Delay para evitar que execute durante carregamento inicial
    const timer = setTimeout(checkBiometric, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animations
  useEffect(() => {
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    logoTranslateY.value = withDelay(300, withTiming(0, { duration: 800 }));
    formOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    formTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        errors.name = 'Nome é obrigatório';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        console.log('📝 Attempting sign up...');
        await signUp(formData.email.trim(), formData.password, formData.name.trim(), userType);
        showAlert('Sucesso', 'Conta criada com sucesso!');
        
        // Após cadastro, mostrar setup de biometria se disponível
        if (biometricAvailable) {
          setLoginCredentials({
            email: formData.email.trim(),
            password: formData.password
          });
          setShowBiometricSetup(true);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        console.log('🔐 Attempting sign in...');
        await signIn(formData.email.trim(), formData.password);
        showAlert('Sucesso', 'Login realizado com sucesso!');
        
        // Após login, mostrar setup de biometria se disponível e não configurado
        if (biometricAvailable && !biometricEnabled) {
          setLoginCredentials({
            email: formData.email.trim(),
            password: formData.password
          });
          setShowBiometricSetup(true);
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      
      let errorMessage = 'Erro desconhecido. Tente novamente.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Verifique seu email para confirmar a conta.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('Erro', errorMessage);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricAvailable || !biometricEnabled) {
      showAlert('Biometria não disponível', 'Configure a biometria primeiro após fazer login.');
      return;
    }
    
    try {
      console.log('🔐 Manual biometric login attempt...');
      const success = await tryBiometricLogin();
      if (success) {
        console.log('✅ Manual biometric login successful');
        router.replace('/(tabs)');
      } else {
        showAlert('Erro', 'Não foi possível fazer login com biometria.');
      }
    } catch (error) {
      console.error('❌ Biometric login error:', error);
      showAlert('Erro', 'Erro na autenticação biométrica.');
    }
  };

  const handleBiometricSetupComplete = (enabled: boolean) => {
    setShowBiometricSetup(false);
    setBiometricEnabled(enabled);
    router.replace('/(tabs)');
  };

  const fillTestUser = (type: 'patient' | 'psychologist') => {
    if (type === 'patient') {
      setFormData({
        email: 'maria.santos@psiquia.com',
        password: '123456',
        name: '',
        confirmPassword: '',
      });
    } else {
      setFormData({
        email: 'joao.silva@psiquia.com',
        password: '123456',
        name: '',
        confirmPassword: '',
      });
    }
    setFormErrors({});
  };

  // Show biometric setup if needed
  if (showBiometricSetup && loginCredentials) {
    return (
      <BiometricSetup
        email={loginCredentials.email}
        password={loginCredentials.password}
        onComplete={handleBiometricSetupComplete}
        onSkip={() => handleBiometricSetupComplete(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10142C', '#1A1A2E', '#10142C']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoShadow}>
              <Image
                source={{ uri: 'https://cdn-ai.onspace.ai/onspace/project/image/9XgCMBWEYMSP5Nq6RviPNc/Imagem_35.jpeg' }}
                style={styles.logo}
                contentFit="contain"
                priority="high"
              />
            </View>
          </Animated.View>

          {/* Biometric Login Button - APENAS SE DISPONÍVEL E HABILITADO */}
          {biometricAvailable && biometricEnabled && !isSignUp && (
            <Animated.View style={[styles.biometricContainer, formAnimatedStyle]}>
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00E5FF', '#7B68EE']}
                  style={styles.biometricGradient}
                >
                  <MaterialIcons name="fingerprint" size={32} color="#FFFFFF" />
                  <Text style={styles.biometricText}>Entrar com Biometria</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>
            </Animated.View>
          )}

          {/* Form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.welcomeTitle}>
                  {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  {isSignUp ? 'Junte-se à PsiqueIA' : 'Entre na sua conta para continuar'}
                </Text>

                {/* User Type Selector for Sign Up */}
                {isSignUp && (
                  <View style={styles.userTypeContainer}>
                    <Text style={styles.userTypeLabel}>Tipo de Conta</Text>
                    <View style={styles.segmentedControl}>
                      <TouchableOpacity
                        style={[
                          styles.segmentOption,
                          userType === 'patient' && styles.segmentOptionActive,
                        ]}
                        onPress={() => setUserType('patient')}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons 
                          name="person" 
                          size={20} 
                          color={userType === 'patient' ? '#FFFFFF' : '#00B09B'} 
                        />
                        <Text style={[
                          styles.segmentText,
                          userType === 'patient' && styles.segmentTextActive
                        ]}>
                          Paciente
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.segmentOption,
                          userType === 'psychologist' && styles.segmentOptionActive,
                        ]}
                        onPress={() => setUserType('psychologist')}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons 
                          name="psychology" 
                          size={20} 
                          color={userType === 'psychologist' ? '#FFFFFF' : '#00B09B'} 
                        />
                        <Text style={[
                          styles.segmentText,
                          userType === 'psychologist' && styles.segmentTextActive
                        ]}>
                          Psicólogo(a)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Name Field (Sign Up only) */}
                {isSignUp && (
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, formErrors.name && styles.inputError]}>
                      <MaterialIcons name="person" size={20} color="#00B09B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Seu nome completo"
                        placeholderTextColor="#82A2FF"
                        value={formData.name}
                        onChangeText={(text) => {
                          setFormData(prev => ({ ...prev, name: text }));
                          if (formErrors.name) {
                            setFormErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        autoCapitalize="words"
                        editable={!loading}
                      />
                    </View>
                    {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
                  </View>
                )}

                {/* Email Field */}
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, formErrors.email && styles.inputError]}>
                    <MaterialIcons name="email" size={20} color="#00B09B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Seu email"
                      placeholderTextColor="#82A2FF"
                      value={formData.email}
                      onChangeText={(text) => {
                        setFormData(prev => ({ ...prev, email: text }));
                        if (formErrors.email) {
                          setFormErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!loading}
                    />
                  </View>
                  {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
                </View>

                {/* Password Field */}
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, formErrors.password && styles.inputError]}>
                    <MaterialIcons name="lock" size={20} color="#00B09B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Sua senha"
                      placeholderTextColor="#82A2FF"
                      value={formData.password}
                      onChangeText={(text) => {
                        setFormData(prev => ({ ...prev, password: text }));
                        if (formErrors.password) {
                          setFormErrors(prev => ({ ...prev, password: '' }));
                        }
                      }}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.passwordToggle}
                      disabled={loading}
                    >
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color="#82A2FF"
                      />
                    </TouchableOpacity>
                  </View>
                  {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
                </View>

                {/* Confirm Password Field (Sign Up only) */}
                {isSignUp && (
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, formErrors.confirmPassword && styles.inputError]}>
                      <MaterialIcons name="lock-outline" size={20} color="#00B09B" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirme sua senha"
                        placeholderTextColor="#82A2FF"
                        value={formData.confirmPassword}
                        onChangeText={(text) => {
                          setFormData(prev => ({ ...prev, confirmPassword: text }));
                          if (formErrors.confirmPassword) {
                            setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }
                        }}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                      />
                    </View>
                    {formErrors.confirmPassword && <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>}
                  </View>
                )}

                {/* Forgot Password (Login only) */}
                {!isSignUp && (
                  <TouchableOpacity 
                    style={styles.forgotPassword}
                    onPress={() => showAlert('Em breve', 'Funcionalidade em desenvolvimento.')}
                  >
                    <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                  </TouchableOpacity>
                )}

                {/* Submit Button */}
                <LoadingButton
                  title={isSignUp ? 'Criar Conta' : 'Entrar'}
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                />

                {/* Toggle Login/SignUp */}
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleText}>
                    {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
                  </Text>
                  <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} disabled={loading}>
                    <Text style={[styles.toggleLink, loading && styles.disabledText]}>
                      {isSignUp ? 'Fazer login' : 'Criar conta'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Test Users (Login only) */}
                {!isSignUp && (
                  <View style={styles.testUsersContainer}>
                    <Text style={styles.testUsersTitle}>👤 Usuários de Teste:</Text>
                    
                    <TouchableOpacity 
                      style={styles.testUserButton}
                      onPress={() => fillTestUser('psychologist')}
                      disabled={loading}
                    >
                      <MaterialIcons name="psychology" size={16} color="#00B09B" />
                      <Text style={styles.testUserText}>
                        🧑‍⚕️ Psicólogo: joao.silva@psiquia.com
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.testUserButton}
                      onPress={() => fillTestUser('patient')}
                      disabled={loading}
                    >
                      <MaterialIcons name="person" size={16} color="#00B09B" />
                      <Text style={styles.testUserText}>
                        👤 Paciente: maria.santos@psiquia.com
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.testPasswordText}>
                      🔑 Senha para ambos: 123456
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Transformando mentes com inteligência
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoShadow: {
    borderRadius: 20,
    shadowColor: '#00B09B',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: 20,
  },
  biometricContainer: {
    marginBottom: 24,
  },
  biometricButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  biometricGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  biometricText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(130, 162, 255, 0.3)',
  },
  dividerText: {
    color: '#82A2FF',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  glassCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(130, 162, 255, 0.2)',
    backgroundColor: '#1D2241',
    overflow: 'hidden',
    shadowColor: '#00B09B',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 15,
  },
  cardContent: {
    padding: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#82A2FF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(29, 34, 65, 0.8)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(130, 162, 255, 0.3)',
  },
  segmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  segmentOptionActive: {
    backgroundColor: '#00B09B',
    shadowColor: '#00B09B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00B09B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 34, 65, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(130, 162, 255, 0.3)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#82A2FF',
  },
  submitButton: {
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleText: {
    color: '#82A2FF',
    fontSize: 16,
  },
  toggleLink: {
    color: '#00B09B',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
  testUsersContainer: {
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.3)',
  },
  testUsersTitle: {
    fontSize: 14,
    color: '#00B09B',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  testUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    marginBottom: 8,
    gap: 8,
  },
  testUserText: {
    fontSize: 12,
    color: '#82A2FF',
    flex: 1,
  },
  testPasswordText: {
    fontSize: 12,
    color: '#00B09B',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#82A2FF',
    fontSize: 14,
    textAlign: 'center',
  },
});