interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

interface AppConfig {
  firebase: FirebaseConfig;
  websocket: {
    url: string;
    arduinoPort: string;
  };
  api: {
    baseUrl: string;
  };
  features: {
    mockData: boolean;
    analytics: boolean;
  };
}

// Validate environment variables
const validateEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

// Configuration object
export const config: AppConfig = {
  firebase: {
    apiKey: validateEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: validateEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: validateEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: validateEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: validateEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: validateEnvVar('VITE_FIREBASE_APP_ID'),
    measurementId: validateEnvVar('VITE_FIREBASE_MEASUREMENT_ID', undefined),
  },
  websocket: {
    url: validateEnvVar('VITE_WS_URL', 'ws://localhost:4000'),
    arduinoPort: validateEnvVar('VITE_ARDUINO_PORT', 'COM5'),
  },
  api: {
    baseUrl: validateEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  },
  features: {
    mockData: validateEnvVar('VITE_MOCK_DATA_ENABLED', 'true') === 'true',
    analytics: validateEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
  },
};

// Firebase initialization utility
export const getFirebaseConfig = (): FirebaseConfig => {
  return config.firebase;
};

// WebSocket configuration utility
export const getWebSocketConfig = () => {
  return config.websocket;
};

// Feature flags utility
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// Environment type check
export const isProduction = (): boolean => {
  return import.meta.env.PROD || false;
};

// Validate all required environment variables on app start
export const validateConfig = (): void => {
  try {
    // Validate Firebase config
    const firebaseConfig = getFirebaseConfig();
    const requiredFirebaseKeys: (keyof FirebaseConfig)[] = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    requiredFirebaseKeys.forEach((key) => {
      if (!firebaseConfig[key]) {
        throw new Error(`Missing required Firebase configuration: ${key}`);
      }
    });

    // Validate WebSocket config
    if (!config.websocket.url) {
      throw new Error('WebSocket URL is required');
    }

    console.log('✅ Environment configuration validated successfully');
  } catch (error) {
    console.error('❌ Environment configuration error:', error);
    throw error;
  }
}; 