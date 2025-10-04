import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

// Helper to safely read env with optional default
function env(name: string, def?: string) {
  return process.env[name] ?? def;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_ENV = env('APP_ENV', 'development');
  const isProd = APP_ENV === 'production';
  const isStaging = APP_ENV === 'staging';

  // Bundle identifiers / packages per environment
  const iosBundleIdBase = 'com.psiqueia.app';
  const androidPackageBase = 'com.psiqueia.app';

  const bundleIdentifier = isProd
    ? iosBundleIdBase
    : isStaging
      ? iosBundleIdBase + '.staging'
      : iosBundleIdBase + '.dev';

  const androidPackage = isProd
    ? androidPackageBase
    : isStaging
      ? androidPackageBase + '.staging'
      : androidPackageBase + '.dev';

  // API URLs per environment (adjust as needed)
  const API_URL = isProd
    ? 'https://api.psiqueia.com'
    : isStaging
      ? 'https://api.staging.psiqueia.com'
      : 'https://api.dev.psiqueia.com';

  return {
    ...config,
    name: isProd ? 'PsiqueIA' : isStaging ? 'PsiqueIA (Staging)' : 'PsiqueIA (Dev)',
    slug: 'psiquia-app',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'psiquia',
    newArchEnabled: true,
    icon: './assets/images/logo.png',
    userInterfaceStyle: 'automatic',
    platforms: ['ios', 'android', 'web'],
    splash: {
      image: './assets/images/logo.png', // TODO: Replace with proper splash artwork (e.g., splash.png)
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier,
      buildNumber: '1',
      deploymentTarget: '15.1',
      requireFullScreen: false,
      infoPlist: {
        // Keep ONLY permissions actually implemented in app logic:
        NSCameraUsageDescription: 'Necessário para capturar fotos/vídeos no diário de humor.',
        NSMicrophoneUsageDescription: 'Necessário para gravar áudios no diário de humor.',
        NSPhotoLibraryUsageDescription: 'Necessário para selecionar imagens do diário de humor.',
        NSFaceIDUsageDescription: 'Face ID para autenticação rápida e segura.',
        // If location is truly needed, uncomment below:
        // NSLocationWhenInUseUsageDescription: 'Necessário para funcionalidades baseadas em localização.',
        // Tracking (ATT) – uncomment ONLY if showing ATT prompt and using ad/analytics requiring it:
        // NSUserTrackingUsageDescription: 'Usamos dados para personalizar a experiência e melhorar serviços.',
        // Remove Health / Contacts / Calendars / Reminders until implemented to avoid Apple rejection.
        ITSAppUsesNonExemptEncryption: false,
        CFBundleAllowMixedLocalizations: true,
        UIBackgroundModes: ['background-fetch']
      },
      associatedDomains: [
        // Confirm domain configuration + AASA file before enabling universal links.
        'applinks:psiqueia.app'
      ]
    },
    android: {
      package: androidPackage,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/images/logo.png',
        backgroundColor: '#ffffff'
      },
      // Keep minimal permissions (others can be auto-added by modules if required). Remove storage if not explicitly needed.
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO'
        // Add conditional permissions as features are implemented.
        // 'android.permission.ACCESS_FINE_LOCATION'
      ],
      blockedPermissions: [
        // Remove unused SYSTEM_ALERT_WINDOW unless there is a floating overlay feature.
        'android.permission.SYSTEM_ALERT_WINDOW'
      ]
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/logo.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/logo.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      [
        'expo-local-authentication',
        { faceIDPermission: 'Use Face ID para autenticação rápida e segura.' }
      ],
      [
        'expo-camera',
        { cameraPermission: 'Necessário para capturar fotos e documentos.' }
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Necessário para selecionar imagens.',
          cameraPermission: 'Necessário para capturar fotos.'
        }
      ],
      [
        'expo-build-properties',
        {
          ios: { deploymentTarget: '15.1' },
          android: { compileSdkVersion: 34, targetSdkVersion: 34, minSdkVersion: 24 }
        }
      ]
    ],
    experiments: { typedRoutes: true },
    updates: {
      fallbackToCacheTimeout: 0,
      // TODO: After running `npx eas update:configure`, add the generated URL below:
      // url: 'https://u.expo.dev/<PROJECT-ID>'
    },
    runtimeVersion: { policy: 'sdkVersion' },
    assetBundlePatterns: ['**/*'],
    extra: {
      APP_ENV,
      API_URL
    }
  };
};
