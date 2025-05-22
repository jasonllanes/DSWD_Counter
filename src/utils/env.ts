export const requiredEnvVars = [
  'VITE_ARDUINO_WS_URL',
  'VITE_API_BASE_URL',
  'VITE_FIREBASE_CONFIG'
] as const;

export type EnvVar = typeof requiredEnvVars[number];

export const validateEnv = () => {
  const missingVars: EnvVar[] = [];

  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    );
  }
};

export const getEnvVar = (key: EnvVar): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}; 