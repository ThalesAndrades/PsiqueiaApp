/**
 * Push Notifications Service
 * 
 * Serviço para gerenciar notificações push e locais.
 * Scaffold básico - expandir conforme necessário.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Configuração padrão de notificações
 * Define como as notificações são apresentadas quando o app está em foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permissões para notificações push
 * @returns Token de notificação ou null se não permitido
 */
export async function requestPermissionsAsync(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notifications] Permissão negada');
      return null;
    }

    console.log('[Notifications] Permissão concedida');
    return await getPushTokenAsync();
  } catch (error) {
    console.error('[Notifications] Erro ao solicitar permissões:', error);
    return null;
  }
}

/**
 * Obtém o token de push notification
 * @returns Token do Expo Push Notification ou null
 */
export async function getPushTokenAsync(): Promise<string | null> {
  try {
    // Verifica se está em dispositivo físico
    if (Constants.isDevice) {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      console.log('[Notifications] Push token:', token.data);
      return token.data;
    } else {
      console.log('[Notifications] Push notifications não funcionam em simulador/emulador');
      return null;
    }
  } catch (error) {
    console.error('[Notifications] Erro ao obter push token:', error);
    return null;
  }
}

/**
 * Agenda uma notificação local
 * @param title Título da notificação
 * @param body Corpo da notificação
 * @param trigger Quando disparar (em segundos ou configuração específica)
 * @returns ID da notificação agendada
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger?: Notifications.NotificationTriggerInput
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || { seconds: 2 },
    });

    console.log('[Notifications] Notificação agendada:', id);
    return id;
  } catch (error) {
    console.error('[Notifications] Erro ao agendar notificação:', error);
    throw error;
  }
}

/**
 * Cancela uma notificação agendada
 * @param notificationId ID da notificação
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('[Notifications] Notificação cancelada:', notificationId);
  } catch (error) {
    console.error('[Notifications] Erro ao cancelar notificação:', error);
  }
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] Todas notificações canceladas');
  } catch (error) {
    console.error('[Notifications] Erro ao cancelar todas notificações:', error);
  }
}

/**
 * Adiciona listener para notificações recebidas
 * @param callback Função a ser chamada quando uma notificação é recebida
 * @returns Subscription que deve ser removida quando não for mais necessária
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Adiciona listener para quando o usuário interage com uma notificação
 * @param callback Função a ser chamada quando usuário clica na notificação
 * @returns Subscription que deve ser removida quando não for mais necessária
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Configura canal de notificação (Android)
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    console.log('[Notifications] Canal de notificação configurado (Android)');
  }
}

/**
 * Inicializa o serviço de notificações
 * Deve ser chamado no início do app
 */
export async function initNotifications(): Promise<void> {
  try {
    await setupNotificationChannel();
    console.log('[Notifications] Serviço inicializado');
  } catch (error) {
    console.error('[Notifications] Erro ao inicializar serviço:', error);
  }
}
