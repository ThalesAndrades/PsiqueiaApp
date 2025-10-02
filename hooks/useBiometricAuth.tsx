import { useState, useEffect, useCallback } from 'react';
import { biometricAuthService } from '../services/biometricAuth';
import { showAlert } from './useAuth';

export interface UseBiometricAuthReturn {
  isAvailable: boolean;
  isEnabled: boolean;
  supportedTypes: string[];
  loading: boolean;
  authenticate: (reason?: string) => Promise<boolean>;
  enableBiometric: (email: string, password: string) => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  getStoredCredentials: () => Promise<{ email: string; password: string } | null>;
  checkAvailability: () => Promise<void>;
}

export function useBiometricAuth(): UseBiometricAuthReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const checkAvailability = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Checking biometric availability...');
      
      const available = await biometricAuthService.isAvailable();
      console.log('🔐 Biometric available:', available);
      
      let enabled = false;
      let types: string[] = [];
      
      if (available) {
        enabled = await biometricAuthService.isBiometricEnabled();
        types = await biometricAuthService.getSupportedTypes();
        console.log('🔐 Biometric enabled:', enabled, 'Types:', types);
      }
      
      setIsAvailable(available);
      setIsEnabled(enabled);
      setSupportedTypes(types);
    } catch (error) {
      console.error('❌ Error checking biometric availability:', error);
      setIsAvailable(false);
      setIsEnabled(false);
      setSupportedTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initBiometric = async () => {
      if (isMounted) {
        await checkAvailability();
      }
    };
    
    initBiometric();
    
    return () => {
      isMounted = false;
    };
  }, [checkAvailability]);

  const authenticate = useCallback(async (reason?: string): Promise<boolean> => {
    try {
      if (!isAvailable || !isEnabled) {
        console.log('⚠️ Biometric not available or not enabled');
        return false;
      }

      console.log('🔐 Attempting biometric authentication...');
      const result = await biometricAuthService.authenticate(reason);
      console.log('🔐 Biometric auth result:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Authentication error:', error);
      showAlert('Erro de Autenticação', 'Não foi possível autenticar com biometria.');
      return false;
    }
  }, [isAvailable, isEnabled]);

  const enableBiometric = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      if (!isAvailable) {
        showAlert(
          'Biometria Não Disponível', 
          'Seu dispositivo não suporta autenticação biométrica ou não há biometrias cadastradas.'
        );
        return false;
      }

      console.log('🔐 Enabling biometric authentication...');

      // Test authentication first
      const authSuccess = await biometricAuthService.authenticate(
        'Confirme sua identidade para ativar o login biométrico'
      );

      if (!authSuccess) {
        console.log('⚠️ Biometric authentication failed during setup');
        return false;
      }

      // Save credentials securely
      await biometricAuthService.saveCredentials(email, password);
      await biometricAuthService.setBiometricEnabled(true);
      
      setIsEnabled(true);
      
      showAlert(
        '🔐 Login Biométrico Ativado!',
        `Agora você pode fazer login usando ${supportedTypes.join(' ou ')}. Suas credenciais estão protegidas de forma segura.`
      );
      
      console.log('✅ Biometric authentication enabled successfully');
      return true;
    } catch (error) {
      console.error('❌ Error enabling biometric:', error);
      showAlert('Erro', 'Não foi possível ativar o login biométrico. Tente novamente.');
      return false;
    }
  }, [isAvailable, supportedTypes]);

  const disableBiometric = useCallback(async (): Promise<void> => {
    try {
      console.log('🔐 Disabling biometric authentication...');
      await biometricAuthService.removeStoredCredentials();
      setIsEnabled(false);
      showAlert('Login Biométrico Desativado', 'Suas credenciais foram removidas com segurança.');
      console.log('✅ Biometric authentication disabled successfully');
    } catch (error) {
      console.error('❌ Error disabling biometric:', error);
      showAlert('Erro', 'Não foi possível desativar o login biométrico.');
    }
  }, []);

  const getStoredCredentials = useCallback(async () => {
    try {
      if (!isEnabled) {
        console.log('⚠️ Biometric not enabled, no stored credentials');
        return null;
      }
      
      const credentials = await biometricAuthService.getStoredCredentials();
      console.log('🔐 Retrieved stored credentials:', !!credentials);
      return credentials;
    } catch (error) {
      console.error('❌ Error getting stored credentials:', error);
      return null;
    }
  }, [isEnabled]);

  return {
    isAvailable,
    isEnabled,
    supportedTypes,
    loading,
    authenticate,
    enableBiometric,
    disableBiometric,
    getStoredCredentials,
    checkAvailability,
  };
}