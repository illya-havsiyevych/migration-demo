import React from 'react';
import { Message as MessageType, Role } from '@/types/models';
import MessageContent from './MessageContent';

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false }) => {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === Role.User ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-3/4 rounded-lg p-3 ${
              message.role === Role.User ? 'bg-[var(--message-user-bg)]' : 'bg-[var(--message-ai-bg)]'
            }`}
          >
            <div className={`text-xs font-medium ${
              message.role === Role.User ? 'text-[var(--message-user-text)]/70' : 'text-[var(--message-ai-text)]/70'
            }`}>
              {message.role === Role.User ? 'You' : 'AI'}
            </div>
            <div className={`${message.role === Role.User ? 'text-[var(--message-user-text)]' : 'text-[var(--message-ai-text)]'} font-medium`}>
              <MessageContent content={message.content} />
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && messages.length === 0 && (
        <div className="flex justify-start">
          <div className="max-w-3/4 rounded-lg bg-[var(--message-ai-bg)] p-3">
            <div className="text-xs font-medium text-[var(--message-ai-text)]/70">AI</div>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-[var(--message-ai-text)]"></div>
              <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-[var(--message-ai-text)]" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--message-ai-text)]" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
