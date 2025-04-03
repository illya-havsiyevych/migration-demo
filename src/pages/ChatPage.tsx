import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { RootState } from '@/store';
import { ConversationsActions } from '@/store/conversations/conversations.slice';
import { ModelsActions } from '@/store/models/models.slice';
import { SettingsActions } from '@/store/settings/settings.slice';
import ChatInput from '@/components/Chat/ChatInput';
import ChatMessages from '@/components/Chat/ChatMessages';
import ModelSelector from '@/components/ModelSelector';
import { ChatStatus } from '@/types/chat';

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId, chatStatus, error } = useSelector(
    (state: RootState) => state.conversations
  );
  const { models } = useSelector((state: RootState) => state.models);
  const { defaultModelId } = useSelector((state: RootState) => state.settings);
  const [message, setMessage] = useState('');

  // Initialize app by fetching models and creating a default conversation if none exists
  useEffect(() => {
    dispatch(SettingsActions.initSettings());
    dispatch(ModelsActions.fetchModels());
    
    // Create a new conversation if none exists
    if (conversations.length === 0 && defaultModelId) {
      dispatch(ConversationsActions.createConversation({ 
        modelId: defaultModelId,
        name: 'New Conversation'
      }));
    }
  }, [dispatch, conversations.length, defaultModelId]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() === '') return;

    if (!currentConversationId) {
      if (defaultModelId) {
        // Create a new conversation with the default model
        const conversationId = uuidv4();
        dispatch(ConversationsActions.createConversation({ 
          modelId: defaultModelId,
          name: message.slice(0, 30) // Use first 30 chars as name
        }));
        dispatch(ConversationsActions.sendMessage({ message, conversationId }));
      } else {
        // No default model available
        console.error('No default model selected');
      }
    } else {
      // Send to existing conversation
      dispatch(ConversationsActions.sendMessage({ message }));
    }

    setMessage('');
  };

  // Find the current conversation
  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {currentConversation ? (
          <ChatMessages 
            messages={currentConversation.messages} 
            isLoading={chatStatus === ChatStatus.Streaming || chatStatus === ChatStatus.Loading}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Welcome to AI DIAL Chat</h2>
              <p>Start a new conversation by sending a message.</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 rounded bg-error/20 p-3 text-error">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="border-t border-neutral/10 bg-base-200 p-4">
        <div className="mb-3 flex justify-between items-center">
          <ModelSelector 
            currentModelId={currentConversation?.modelId} 
            disabled={chatStatus === ChatStatus.Streaming || chatStatus === ChatStatus.Loading}
          />
        </div>
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          disabled={chatStatus === ChatStatus.Streaming || chatStatus === ChatStatus.Loading}
          isLoading={chatStatus === ChatStatus.Streaming || chatStatus === ChatStatus.Loading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
