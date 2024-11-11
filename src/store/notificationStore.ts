import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define the structure of a notification
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info'; // Different notification types
  duration?: number; // Optional duration for auto-dismissal in milliseconds
}

// Define the store's state and actions
interface NotificationStore {
  notifications: Notification[];                        // List of notifications
  addNotification: (message: string, type: Notification['type'], duration?: number) => void; // Action to add a notification
  removeNotification: (id: string) => void;             // Action to remove a notification by ID
  clearNotifications: () => void;                       // Action to clear all notifications
}

// Zustand store for managing notifications
export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],  // Initialize with an empty array of notifications

  // Adds a new notification
  addNotification: (message, type, duration) => {
    const id = uuidv4(); // Generate a unique ID for the notification
    const newNotification: Notification = { id, message, type, duration };

    set((state) => ({
      notifications: [...state.notifications, newNotification], // Add the new notification to the list
    }));

    // Automatically remove the notification after the specified duration, if provided
    if (duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        }));
      }, duration);
    }
  },

  // Removes a specific notification by ID
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),

  // Clears all notifications from the store
  clearNotifications: () => set({ notifications: [] }),
}));