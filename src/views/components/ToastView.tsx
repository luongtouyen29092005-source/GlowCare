import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../../types';
import { notificationController } from '../../controllers/NotificationController';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastView: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return notificationController.subscribe((updated) => {
      setToasts(updated);
    });
  }, []);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />;
    }
  };

  const getBgBorder = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-white border-emerald-200 shadow-emerald-500/10';
      case 'warning':
        return 'bg-white border-amber-200 shadow-amber-500/10';
      case 'error':
        return 'bg-white border-rose-200 shadow-rose-500/10';
      case 'info':
      default:
        return 'bg-white border-stone-200 shadow-stone-500/10';
    }
  };

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 ${getBgBorder(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-stone-900 leading-snug">{toast.title}</h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              id={`close-toast-${toast.id}`}
              onClick={() => notificationController.remove(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
