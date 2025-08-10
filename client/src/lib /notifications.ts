// Notifications manager pro VISIBLO Chat
export class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isAdmin: boolean = false;
  private readonly STORAGE_KEY = 'visiblo-chat-admin-device';

  async initialize(isAdmin: boolean = false) {
    this.isAdmin = isAdmin;

    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      // Registrovat SW vždy, neodstraňovat existující registrace
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      await navigator.serviceWorker.ready;
      console.log('Service Worker registered and ready');

      if (isAdmin) {
        localStorage.setItem(this.STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  isAdminDevice(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isAdmin && !this.isAdminDevice()) return false;

    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      const granted = permission === 'granted';
      if (granted) {
        localStorage.setItem(this.STORAGE_KEY + '-permission', 'granted');
      }

      return granted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  getCurrentPermission(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  async showLocalNotification(title: string, body: string): Promise<void> {
    if (!this.isAdminDevice() || this.getCurrentPermission() !== 'granted') return;

    if (document.visibilityState === 'visible' && document.hasFocus()) {
      return; // Neposílat notifikaci, když je aplikace aktivní
    }

    try {
      const options: NotificationOptions = {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        requireInteraction: false,
        silent: false,
        tag: 'visiblo-message'
      };

      if (this.registration && this.registration.active) {
        await this.registration.showNotification(title, options);
      } else {
        new Notification(title, options);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
      try {
        new Notification(title, {
          body,
          icon: '/vite.svg',
        });
      } catch (fallbackError) {
        console.error('Fallback notification also failed:', fallbackError);
      }
    }
  }

  async checkNotificationSupport(): Promise<{
    supported: boolean;
    permission: NotificationPermission;
    serviceWorker: boolean;
    isAdminDevice: boolean;
  }> {
    return {
      supported: 'Notification' in window,
      permission: this.getCurrentPermission(),
      serviceWorker: 'serviceWorker' in navigator,
      isAdminDevice: this.isAdminDevice()
    };
  }

  clearAdminDevice(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY + '-permission');
  }
}

export const notificationManager = new NotificationManager();
