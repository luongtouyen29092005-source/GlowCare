import { MVCEventLog } from '../types';

type EventCallback = (data?: any) => void;

class MVCEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private logs: MVCEventLog[] = [];
  private logListeners: Set<(logs: MVCEventLog[]) => void> = new Set();

  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event callback for ${event}:`, err);
        }
      });
    }
  }

  public logAction(layer: 'Model' | 'View' | 'Controller', action: string, details: string): void {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    const newLog: MVCEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      layer,
      action,
      details,
    };

    this.logs = [newLog, ...this.logs.slice(0, 49)];
    this.logListeners.forEach((listener) => listener(this.logs));
  }

  public subscribeLogs(callback: (logs: MVCEventLog[]) => void): () => void {
    this.logListeners.add(callback);
    callback(this.logs);
    return () => {
      this.logListeners.delete(callback);
    };
  }

  public getLogs(): MVCEventLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.logListeners.forEach((listener) => listener(this.logs));
  }
}

export const eventBus = new MVCEventBus();
