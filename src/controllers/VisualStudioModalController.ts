import { eventBus } from '../models/EventBus';

class VisualStudioModalController {
  private isOpen: boolean = false;
  private activeTab: 'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code' = 'aspnet';
  private listeners: Set<(open: boolean, tab: 'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code') => void> = new Set();

  public subscribe(listener: (open: boolean, tab: 'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code') => void): () => void {
    this.listeners.add(listener);
    listener(this.isOpen, this.activeTab);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.isOpen, this.activeTab));
  }

  public open(tab: 'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code' = 'aspnet'): void {
    this.isOpen = true;
    this.activeTab = tab;
    this.notify();
    eventBus.logAction(
      'Controller',
      'VisualStudioModalController.open',
      `Mở hướng dẫn chạy trên Visual Studio & SQL (Tab: ${tab})`
    );
  }

  public setTab(tab: 'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code'): void {
    this.activeTab = tab;
    this.notify();
  }

  public close(): void {
    this.isOpen = false;
    this.notify();
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
    this.notify();
  }
}

export const visualStudioModalController = new VisualStudioModalController();
