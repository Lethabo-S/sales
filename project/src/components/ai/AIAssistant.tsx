// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChatBubbleLeftRightIcon,
//   PaperAirplaneIcon,
//   SparklesIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';
// import { useAuth } from '../../contexts/AuthContext';
// import { AIMessage } from '../../types/messaging';
// import Button from '../ui/Button';

// interface AIAssistantProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<AIMessage[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: 'Hello! I\'m your AI assistant. How can I help you today?',
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const userMessage: AIMessage = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: newMessage.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiResponse: AIMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: generateAIResponse(userMessage.content),
//         timestamp: new Date().toISOString(),
//       };

//       setMessages(prev => [...prev, aiResponse]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const generateAIResponse = (userInput: string): string => {
//     const input = userInput.toLowerCase();
    
//     if (input.includes('billing') || input.includes('subscription') || input.includes('payment')) {
//       return 'I can help you with billing questions! You can manage your subscription, view invoices, and update payment methods in the Billing section. Would you like me to guide you through any specific billing task?';
//     }
    
//     if (input.includes('security') || input.includes('password') || input.includes('2fa') || input.includes('two factor')) {
//       return 'For security settings, you can enable two-factor authentication, manage active sessions, and review security logs in the Security section. I recommend enabling 2FA for better account protection. Need help with any security features?';
//     }
    
//     if (input.includes('analytics') || input.includes('usage') || input.includes('metrics')) {
//       return 'The Analytics dashboard shows comprehensive usage metrics, response times, sentiment analysis, and usage heatmaps. You can export data in various formats and create custom reports. What specific analytics would you like to explore?';
//     }
    
//     if (input.includes('help') || input.includes('support')) {
//       return 'I can help you with various tasks like navigating the dashboard, understanding features, or troubleshooting issues. What specific area would you like assistance with?';
//     }
    
//     if (input.includes('dashboard') || input.includes('analytics')) {
//       return 'The dashboard provides comprehensive insights into your sales and procurement data. You can view KPIs, charts, and AI-powered recommendations. Would you like me to explain any specific section?';
//     }
    
//     if (input.includes('notification') || input.includes('alert')) {
//       return 'You can manage your notifications in the notification center. You can mark them as read, delete them, or adjust your notification preferences in settings.';
//     }
    
//     if (input.includes('settings') || input.includes('profile')) {
//       return 'In settings, you can update your profile information, change notification preferences, adjust privacy settings, and customize your theme. Is there a specific setting you\'d like to modify?';
//     }
    
//     if (input.includes('message') || input.includes('chat')) {
//       return 'The messaging system allows you to communicate with team members in real-time. You can send direct messages, create group chats, and share files. Need help with any messaging features?';
//     }
    
//     return 'I understand you\'re asking about "' + userInput + '". Could you provide more details so I can give you a more specific answer? I\'m here to help with any questions about the platform.';
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp: string) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95, y: 20 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95, y: 20 }}
//       className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <SparklesIcon className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//               AI Assistant
//             </h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               Always here to help
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
//         >
//           <XMarkIcon className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         <AnimatePresence>
//           {messages.map((message) => (
//             <motion.div
//               key={message.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`flex ${
//                 message.role === 'user' ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div
//                 className={`max-w-[80%] px-3 py-2 rounded-lg ${
//                   message.role === 'user'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
//                 }`}
//               >
//                 <p className="text-sm">{message.content}</p>
//                 <p className="text-xs opacity-70 mt-1">
//                   {formatTime(message.timestamp)}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
        
//         {isTyping && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex justify-start"
//           >
//             <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//               </div>
//             </div>
//           </motion.div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <input
//             ref={inputRef}
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Ask me anything..."
//             className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim() || isTyping}
//             variant="primary"
//             size="sm"
//           >
//             <PaperAirplaneIcon className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AIAssistant;
// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChatBubbleLeftRightIcon,
//   PaperAirplaneIcon,
//   SparklesIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';
// import { useAuth } from '../../contexts/AuthContext';
// import type { AIMessage } from '../../types/messaging';
// import Button from '../ui/Button';

// interface AIAssistantProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<AIMessage[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Hello! I'm your AI assistant. How can I help you today?",
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const userMessage: AIMessage = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: newMessage.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     try {
//       const res = await fetch('http://localhost:5000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: userMessage.content }),
//       });

//       const data = await res.json();

//       const aiResponse: AIMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: data.response || 'Sorry, I couldn’t process that.',
//         timestamp: new Date().toISOString(),
//       };

//       setMessages(prev => [...prev, aiResponse]);
//     } catch (error) {
//       const errorResponse: AIMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content:
//           'Oops! Something went wrong while contacting the AI service.',
//         timestamp: new Date().toISOString(),
//       };
//       setMessages(prev => [...prev, errorResponse]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp: string) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95, y: 20 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95, y: 20 }}
//       className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <SparklesIcon className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//               AI Assistant
//             </h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               Always here to help
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
//         >
//           <XMarkIcon className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         <AnimatePresence>
//           {messages.map((message) => (
//             <motion.div
//               key={message.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`flex ${
//                 message.role === 'user' ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div
//                 className={`max-w-[80%] px-3 py-2 rounded-lg ${
//                   message.role === 'user'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
//                 }`}
//               >
//                 <p className="text-sm">{message.content}</p>
//                 <p className="text-xs opacity-70 mt-1">
//                   {formatTime(message.timestamp)}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>

//         {isTyping && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex justify-start"
//           >
//             <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.1s' }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.2s' }}
//                 ></div>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <input
//             ref={inputRef}
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Ask me anything..."
//             className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim() || isTyping}
//             variant="primary"
//             size="sm"
//           >
//             <PaperAirplaneIcon className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AIAssistant;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
};

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/chat',
        { query: trimmed },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const botReply: Message = {
        sender: 'bot',
        text: response.data.response || 'Sorry, I couldn’t process that.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error: unknown) {
      let errorText = 'An unexpected error occurred.';
      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.error || error.message || errorText;
      }

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `Error: ${errorText}`, timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Always here to help
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!query.trim() || loading}
            variant="primary"
            size="sm"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
