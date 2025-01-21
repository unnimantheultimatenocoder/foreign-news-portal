import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foreignnews.app',
  appName: 'Foreign News Portal',
  webDir: 'dist',
  server: {
    url: 'https://aroundtheglobenews.netlify.app',
    androidScheme: 'https',
    allowNavigation: ['*', 'aroundtheglobenews.netlify.app'],
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1A1F2C",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#ef4444"
    }
  }
};

export default config;
