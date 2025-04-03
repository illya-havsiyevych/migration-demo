import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role } from '@/types/models';
import { Attachment, ChatStatus, Conversation } from '@/types/chat';

export interface ConversationsState {
  conversations: Conversation[];
  currentConversationId: string | null;
  chatStatus: ChatStatus;
  error: string | null;
  attachments: Attachment[];
}

// Initial state for conversations
const initialState: ConversationsState = {
  conversations: [],
  currentConversationId: null,
  chatStatus: ChatStatus.Idle,
  error: null,
  attachments: [],
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    // Set the current conversation
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    
    // Create a new conversation
    createConversation: (state, action: PayloadAction<{ modelId: string; name?: string }>) => {
      const { modelId, name } = action.payload;
      const timestamp = Date.now();
      const newConversation: Conversation = {
        id: uuidv4(),
        name: name || 'New Conversation',
        messages: [],
        modelId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      state.conversations.push(newConversation);
      state.currentConversationId = newConversation.id;
    },
    
    // Update conversation (metadata only)
    updateConversation: (state, action: PayloadAction<{ id: string; conversation: Partial<Conversation> }>) => {
      const { id, conversation } = action.payload;
      const existingConversation = state.conversations.find(c => c.id === id);
      
      if (existingConversation) {
        Object.assign(existingConversation, {
          ...conversation,
          updatedAt: Date.now(),
        });
      }
    },
    
    // Update conversation model
    updateConversationModel: (
      state,
      action: PayloadAction<{ conversationId: string; modelId: string }>
    ) => {
      const { conversationId, modelId } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.modelId = modelId;
        conversation.updatedAt = Date.now();
      }
    },
    
    // Delete conversation
    deleteConversation: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.conversations = state.conversations.filter(c => c.id !== id);
      
      if (state.currentConversationId === id) {
        state.currentConversationId = state.conversations.length > 0 
          ? state.conversations[0].id 
          : null;
      }
    },
    
    // Clear all conversations
    clearConversations: (state) => {
      state.conversations = [];
      state.currentConversationId = null;
    },
    
    // Send a message in the current conversation
    sendMessage: (state, action: PayloadAction<{ message: string; conversationId?: string }>) => {
      const { message, conversationId } = action.payload;
      const targetId = conversationId || state.currentConversationId;
      
      if (!targetId) {
        state.error = 'No active conversation';
        return;
      }
      
      const conversation = state.conversations.find(c => c.id === targetId);
      if (!conversation) {
        state.error = 'Conversation not found';
        return;
      }
      
      // Add user message
      conversation.messages.push({
        role: Role.User,
        content: message,
      });
      
      conversation.updatedAt = Date.now();
      state.chatStatus = ChatStatus.Loading;
    },
    
    // Set messages for a conversation
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.messages = messages;
        conversation.updatedAt = Date.now();
      }
    },
    
    // Start receiving streaming response
    streamingStart: (state) => {
      state.chatStatus = ChatStatus.Streaming;
    },
    
    // Append chunk to the last assistant message
    streamingChunk: (state, action: PayloadAction<{ conversationId: string; chunk: string }>) => {
      const { conversationId, chunk } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (!conversation) return;
      
      // Find or create assistant message
      let assistantMessage = conversation.messages.find(
        (m) => m.role === Role.Assistant && conversation.messages.indexOf(m) === conversation.messages.length - 1
      );
      
      if (!assistantMessage) {
        // Create a new assistant message if none exists
        assistantMessage = {
          role: Role.Assistant,
          content: '',
        };
        conversation.messages.push(assistantMessage);
      }
      
      // Append chunk to the message content
      assistantMessage.content += chunk;
      conversation.updatedAt = Date.now();
    },
    
    // Complete streaming response
    streamingEnd: (state) => {
      state.chatStatus = ChatStatus.Idle;
    },
    
    // Handle errors
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.chatStatus = ChatStatus.Error;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.chatStatus = ChatStatus.Idle;
    },
    
    // Add an attachment
    addAttachment: (state, action: PayloadAction<Attachment>) => {
      state.attachments.push(action.payload);
    },
    
    // Remove an attachment
    removeAttachment: (state, action: PayloadAction<string>) => {
      state.attachments = state.attachments.filter(a => a.id !== action.payload);
    },
  },
});

export const ConversationsActions = conversationsSlice.actions;

export default conversationsSlice.reducer;
