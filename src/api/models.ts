import { apiClient } from './client';
import { config } from '@/config';
import { Observable, map } from 'rxjs';
import { DialAIEntityModel, DialAIEntityAddon } from '@/types/models';

/**
 * Transform the raw models API response to the expected format
 */
function transformModelsResponse(rawData: any): { models: DialAIEntityModel[] } {
  if (!rawData.data || !Array.isArray(rawData.data)) {
    throw new Error('Invalid API response format');
  }
  
  return {
    models: rawData.data.map(model => ({
      id: model.id,
      name: model.name || model.id,
      type: 'model',
      reference: model.id,
      features: model.capabilities?.features || {},
      limits: model.capabilities?.limits || {},
      tokenizer: model.capabilities?.tokenizer || { name: 'default' }
    }))
  };
}

/**
 * Fetch available AI models
 */
export const getModels = () => {
  return apiClient.get<any>('/models').pipe(
    map(rawResponse => transformModelsResponse(rawResponse))
  );
};

/**
 * Transform the raw addons API response if needed
 */
function transformAddonsResponse(rawData: any): { addons: DialAIEntityAddon[] } {
  if (!rawData.data || !Array.isArray(rawData.data)) {
    return { addons: [] }; // Return empty array if no addons
  }
  
  return {
    addons: rawData.data.map(addon => ({
      id: addon.id,
      name: addon.name || addon.id,
      type: 'addon',
      description: addon.description || '',
      // Add any other fields needed
    }))
  };
}

/**
 * Fetch available addons
 */
export const getAddons = () => {
  return apiClient.get<any>('/addons').pipe(
    map(rawResponse => transformAddonsResponse(rawResponse))
  );
};

/**
 * Send a message to the chat API
 */
export const sendMessage = (conversationId: string, messages: any[], modelId: string, temperature?: number, selectedAddons?: string[]) => {
  return apiClient.post('/chat', {
    id: conversationId,
    messages,
    model: { id: modelId },
    temperature,
    selectedAddons,
  });
};

/**
 * Transform the chat API request to match the expected format for the DIAL API
 */
function transformChatRequest(conversationId: string, messages: any[], modelId: string, modelReference: string, temperature?: number, selectedAddons?: string[]): any {
  // Since we're using a direct model endpoint in the proxy, we don't need to specify the model in the request
  // Instead, we just need to format the messages correctly
  const transformedBody = {
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    temperature: temperature !== undefined ? temperature : config.defaultTemperature,
    stream: true
  };
  
  // Only include selectedAddons if they're provided (using the format Azure OpenAI expects)
  if (selectedAddons && selectedAddons.length > 0) {
    transformedBody.functions = selectedAddons.map(addon => ({
      name: addon
    }));
  }
  
  // Store conversationId in a property that Azure OpenAI ignores but we can use for tracking
  transformedBody.user = conversationId;
  
  console.log("Transformed request:", JSON.stringify(transformedBody, null, 2));
  
  return transformedBody;
}

/**
 * Stream a chat completion response
 */
export const streamChatCompletion = (conversationId: string, messages: any[], modelId: string, temperature?: number, selectedAddons?: string[]): Observable<Response> => {
  // Find the model reference if we have the models
  let modelReference = modelId;
  const store = window['__REDUX_STORE__'];
  if (store) {
    const state = store.getState();
    const models = state.models?.models;
    if (Array.isArray(models)) {
      const model = models.find(m => m.id === modelId);
      if (model && model.reference) {
        modelReference = model.reference;
        console.log(`Using model reference: ${modelReference} for model ID: ${modelId}`);
      }
    }
  }

  // Create transformed request body
  const requestBody = transformChatRequest(
    conversationId, 
    messages, 
    modelId, 
    modelReference, 
    temperature, 
    selectedAddons
  );
  
  console.log('Chat request body:', JSON.stringify(requestBody));
  // Include the modelReference in the URL path so the proxy can route to the correct model
  return apiClient.stream(`/chat/${modelReference}`, requestBody);
};
