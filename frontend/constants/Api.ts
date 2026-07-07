import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;

function getDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(':')[0];
  return host || null;
}

function getDefaultBaseUrl(): string {
  const devHost = getDevServerHost();
  if (devHost) {
    return `http://${devHost}:${DEFAULT_PORT}`;
  }

  if (Platform.OS === 'android') {
    // Yalnızca Android emülatörü için geçerli
    return `http://10.0.2.2:${DEFAULT_PORT}`;
  }

  return `http://localhost:${DEFAULT_PORT}`;
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? getDefaultBaseUrl();

if (__DEV__) {
  console.log('[Netly] API base URL:', API_BASE_URL);
}
