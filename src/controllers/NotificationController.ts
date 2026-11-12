import { ToastMessage } from '../types';

class NotificationController {
  private toasts: ToastMessage[] = [];
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();

  public subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  public show(type: 'success' | 'info' | 'warning' | 'error', title: string, message: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message };
    
    this.toasts = [...this.toasts, newToast];
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  public remove(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const notificationController = new NotificationController();
