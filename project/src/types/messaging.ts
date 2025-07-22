export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId?: string;
  channelId?: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
  replyTo?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'public';
  participants: string[];
  createdBy: string;
  createdAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'system' | 'alert' | 'update';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}