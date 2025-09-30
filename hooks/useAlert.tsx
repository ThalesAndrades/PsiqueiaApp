import { Alert, Platform } from 'react-native';

export interface AlertOptions {
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

export const useAlert = () => {
  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      // Para web, use um alert customizado ou window.alert
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && onOk) {
        onOk();
      }
    } else {
      // Para mobile, use o Alert nativo
      Alert.alert(
        title, 
        message, 
        onOk ? [{ text: 'OK', onPress: onOk }] : [{ text: 'OK' }]
      );
    }
  };

  const showConfirmAlert = ({ title, message, buttons }: AlertOptions) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && buttons && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!confirmed && buttons && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  return { showAlert, showConfirmAlert };
};

export const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(
      title, 
      message, 
      onOk ? [{ text: 'OK', onPress: onOk }] : [{ text: 'OK' }]
    );
  }
};