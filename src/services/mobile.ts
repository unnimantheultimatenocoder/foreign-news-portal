import { Network } from '@capacitor/network';
import { Share } from '@capacitor/share';
import { Storage } from '@capacitor/storage';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

class MobileService {
  private static instance: MobileService;
  private isOnline: boolean = true;

  private constructor() {
    this.initializeApp();
  }

  public static getInstance(): MobileService {
    if (!MobileService.instance) {
      MobileService.instance = new MobileService();
    }
    return MobileService.instance;
  }

  private async initializeApp() {
    // Initialize network monitoring
    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
    });

    // Get initial network status
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    // Setup status bar
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#1A1F2C' });
    } catch (e) {
      console.warn('Status bar customization not available');
    }

    // Hide splash screen when app is ready
    await SplashScreen.hide();

    // Handle back button
    App.addListener('backButton', () => {
      if (window.location.pathname === '/') {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
  }

  public async shareContent(title: string, text: string, url?: string) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Share with friends'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  public async saveData(key: string, value: any) {
    try {
      await Storage.set({
        key,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  public async getData(key: string) {
    try {
      const { value } = await Storage.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  public async removeData(key: string) {
    try {
      await Storage.remove({ key });
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  public isNetworkConnected(): boolean {
    return this.isOnline;
  }
}

export const mobileService = MobileService.getInstance();