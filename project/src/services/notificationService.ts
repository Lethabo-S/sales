import { Notification } from '../types/messaging';

class NotificationService {
  private notifications: Notification[] = [
    {
      id: '1',
      userId: '1',
      type: 'system',
      title: 'Welcome to the platform!',
      content: 'Your account has been successfully created.',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      userId: '1',
      type: 'message',
      title: 'New message from John Doe',
      content: 'Hey, how are you doing?',
      isRead: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      actionUrl: '/messages/john-doe',
    },
    {
      id: '3',
      userId: '1',
      type: 'alert',
      title: 'Security Alert',
      content: 'New login detected from Chrome on Windows',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications
      .filter(n => n.userId === userId)
      .forEach(n => n.isRead = true);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }
}

export const notificationService = new NotificationService();