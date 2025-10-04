/**
 * Sentry Configuration
 * 
 * Inicialização condicional do Sentry para monitoramento de erros.
 * Apenas ativa se SENTRY_DSN estiver configurado.
 */

import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

/**
 * Inicializa o Sentry se DSN estiver configurado
 */
export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

  if (!dsn) {
    console.log('[Sentry] DSN não configurado - monitoramento desabilitado');
    return;
  }

  try {
    Sentry.init({
      dsn,
      enableInExpoDevelopment: false,
      debug: __DEV__,
      environment: __DEV__ ? 'development' : 'production',
      tracesSampleRate: __DEV__ ? 0 : 1.0,
      release: Constants.expoConfig?.version || '1.0.0',
      dist: Constants.expoConfig?.ios?.buildNumber || 
            Constants.expoConfig?.android?.versionCode?.toString() || 
            '1',
    });

    console.log('[Sentry] Inicializado com sucesso');
  } catch (error) {
    console.error('[Sentry] Erro ao inicializar:', error);
  }
}

/**
 * Captura uma exceção manualmente
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('[Sentry] Erro capturado (DSN não configurado):', error, context);
  }
}

/**
 * Adiciona breadcrumb para rastreamento
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  if (process.env.EXPO_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      data,
      level: 'info',
    });
  }
}

export default Sentry;
