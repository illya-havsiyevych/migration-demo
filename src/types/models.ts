export enum EntityType {
  Application = 'application',
  Assistant = 'assistant',
  Model = 'model',
  Addon = 'addon',
}

export enum ModelStatus {
  Normal = 'normal',
  Updating = 'updating',
  Deleting = 'deleting',
  Creating = 'creating',
}

export enum Role {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
  Function = 'function',
  Tool = 'tool',
}

export interface Message {
  role: Role;
  content: string;
  custom_content?: Record<string, any>;
}

export interface ModelFeatures {
  truncatePrompt?: boolean;
  textToSpeech?: boolean;
  moderation?: boolean;
  allowAttachments?: boolean;
  allowAddons?: boolean;
  allowSystemPrompt?: boolean;
  allowTemperature?: boolean;
}

export interface ModelLimits {
  maxRequestTokens?: number;
  maxResponseTokens?: number;
  maxTotalTokens?: number;
}

export interface ModelTokenizer {
  name: string;
  runtimeUrl?: string;
}

export interface ModelCapabilities {
  features?: ModelFeatures;
  limits?: ModelLimits;
  tokenizer?: ModelTokenizer;
}

export interface DialAIEntity {
  id: string;
  name: string;
  type: EntityType;
  reference?: string; // The underlying model ID used for API calls
  description?: string;
  status?: ModelStatus;
  icon?: string;
  displayName?: string;
}

export interface DialAIEntityModel extends DialAIEntity, ModelCapabilities {}

export interface DialAIEntityAddon extends DialAIEntity {}
