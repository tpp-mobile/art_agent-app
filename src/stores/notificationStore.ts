import { create } from 'zustand';
import { Toast, ToastType } from '../types';

interface NotificationState {
  toasts: Toast[];

  // Actions
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  toasts: [],

  showToast: (type: ToastType, title: string, message?: string, duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, type, title, message, duration };

    set(state => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }
  },

  dismissToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Convenience functions
export const showSuccess = (title: string, message?: string) => {
  useNotificationStore.getState().showToast('success', title, message);
};

export const showError = (title: string, message?: string) => {
  useNotificationStore.getState().showToast('error', title, message);
};

export const showWarning = (title: string, message?: string) => {
  useNotificationStore.getState().showToast('warning', title, message);
};

export const showInfo = (title: string, message?: string) => {
  useNotificationStore.getState().showToast('info', title, message);
};
