import { eventBus } from '../models/EventBus';

class MVCInspectorController {
  private isOpen: boolean = false;
  private listeners: Set<(open: boolean) => void> = new Set();

  public subscribe(listener: (open: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isOpen);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
    this.listeners.forEach((l) => l(this.isOpen));
    eventBus.logAction('Controller', 'MVCInspectorController.toggle', `Đã ${this.isOpen ? 'mở' : 'đóng'} bảng kiểm tra kiến trúc MVC`);
  }

  public open(): void {
    this.isOpen = true;
    this.listeners.forEach((l) => l(true));
  }

  public close(): void {
    this.isOpen = false;
    this.listeners.forEach((l) => l(false));
  }

  public clearLogs(): void {
    eventBus.clearLogs();
  }
}

export const mvcInspectorController = new MVCInspectorController();
