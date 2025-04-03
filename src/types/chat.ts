import { Message } from './models';

export interface ChatBody {
  id: string;
  messages: Message[];
  prompt?: string;
  temperature?: number;
  selectedAddons?: string[];
  model: {
    id: string;
  };
  assistantModel?: {
    id: string;
  };
}

export enum ChatStatus {
  Idle = 'idle',
  Loading = 'loading',
  Streaming = 'streaming',
  Error = 'error',
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  modelId: string;
  temperature?: number;
  selectedAddons?: string[];
  createdAt: number;
  updatedAt: number;
  folderId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  conversationId?: string;
  messageIndex?: number;
}
