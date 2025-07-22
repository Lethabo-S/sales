import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { ChatChannel, Message } from '../types/messaging';
import ChatInterface from '../components/chat/ChatInterface';
import Button from '../components/ui/Button';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const [channels] = useState<ChatChannel[]>([
    {
      id: '1',
      name: 'General',
      type: 'public',
      participants: ['1', '2', '3'],
      createdBy: '1',
      createdAt: '2024-01-01T00:00:00Z',
      unreadCount: 3,
      lastMessage: {
        id: '1',
        content: 'Hey everyone, how are you doing?',
        senderId: '2',
        senderName: 'John Doe',
        timestamp: '2024-01-19T10:30:00Z',
        isRead: false,
        isEdited: false,
        type: 'text',
      },
    },
    {
      id: '2',
      name: 'Project Team',
      type: 'group',
      participants: ['1', '2'],
      createdBy: '1',
      createdAt: '2024-01-02T00:00:00Z',
      unreadCount: 0,
      lastMessage: {
        id: '2',
        content: 'The project is on track!',
        senderId: '1',
        senderName: 'You',
        timestamp: '2024-01-19T09:15:00Z',
        isRead: true,
        isEdited: false,
        type: 'text',
      },
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey everyone, how are you doing?',
      senderId: '2',
      senderName: 'John Doe',
      timestamp: '2024-01-19T10:30:00Z',
      isRead: true,
      isEdited: false,
      type: 'text',
    },
    {
      id: '2',
      content: 'I\'m doing great! Working on the new dashboard features.',
      senderId: '1',
      senderName: 'You',
      timestamp: '2024-01-19T10:32:00Z',
      isRead: true,
      isEdited: false,
      type: 'text',
    },
    {
      id: '3',
      content: 'That sounds awesome! Can\'t wait to see it.',
      senderId: '3',
      senderName: 'Jane Smith',
      timestamp: '2024-01-19T10:35:00Z',
      isRead: false,
      isEdited: false,
      type: 'text',
    },
  ]);

  const handleSendMessage = (content: string) => {
    if (!user || !selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.id,
      senderName: user.name,
      channelId: selectedChannel.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      isEdited: false,
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Messages
            </h1>
            <Button variant="primary" size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChannels.map((channel) => (
            <motion.button
              key={channel.id}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 transition-colors ${
                selectedChannel?.id === channel.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {channel.name}
                </h3>
                {channel.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {channel.unreadCount}
                  </span>
                )}
              </div>
              {channel.lastMessage && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {channel.lastMessage.senderName === 'You' ? 'You: ' : ''}
                    {channel.lastMessage.content}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                    {new Date(channel.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedChannel ? (
          <ChatInterface
            channel={selectedChannel}
            messages={messages.filter(m => m.channelId === selectedChannel.id || !m.channelId)}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a conversation from the sidebar to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;