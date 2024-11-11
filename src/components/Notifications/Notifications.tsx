import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';

// Notification component to display each notification with styles based on type
export function NotificationList() {
  // Get notifications and the remove action from the store
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  // Define styles for each notification type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-4 w-80 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border-l-4 p-4 rounded-md shadow-md ${getNotificationStyle(notification.type)}`}
        >
          <div className="flex justify-between items-start">
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-lg font-semibold leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}