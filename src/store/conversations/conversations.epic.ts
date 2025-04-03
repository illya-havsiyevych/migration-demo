import { combineEpics, ofType } from 'redux-observable';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { ConversationsActions } from './conversations.slice';
import * as modelsApi from '@/api/models';
import { createParser } from 'eventsource-parser';
import { store } from '@/store';

// Epic for sending a message
const sendMessageEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(ConversationsActions.sendMessage.type),
    switchMap((action) => {
      const conversationId = action.payload.conversationId || state$.value.conversations.currentConversationId;
      const conversation = state$.value.conversations.conversations.find((c: any) => c.id === conversationId);
      
      if (!conversation) {
        return of(ConversationsActions.setError('Conversation not found'));
      }
      
      const modelId = conversation.modelId;
      
      return from(modelsApi.streamChatCompletion(
        conversationId,
        conversation.messages,
        modelId,
        conversation.temperature
      )).pipe(
        switchMap((response) => {
          return from(handleChatResponse(response, conversationId));
        }),
        takeUntil(action$.pipe(ofType(ConversationsActions.clearError.type))),
        catchError((error) => {
          console.error('Error in sendMessageEpic:', error);
          return of(ConversationsActions.setError(error.message || 'Failed to send message'));
        })
      );
    })
  );

// Helper function to parse and handle streaming response
const handleChatResponse = async (response: Response, conversationId: string) => {
  // Signal that streaming is starting
  // Use the store's dispatch
  store.dispatch(ConversationsActions.streamingStart());
  
  try {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }
    
    const parser = createParser((event) => {
      if (event.type === 'event') {
        try {
          // Check if it's the completion marker
          if (event.data === '[DONE]') {
            store.dispatch(ConversationsActions.streamingEnd());
            return of();
          }
          
          const data = JSON.parse(event.data);
          console.log("Stream data:", event.data);
          
          // Handle different response formats from OpenAI API
          if (data.choices && data.choices[0]?.delta?.content) {
            store.dispatch(ConversationsActions.streamingChunk({
              conversationId,
              chunk: data.choices[0].delta.content,
            }));
          } else if (data.content) { 
            // Fallback for the original format if present
            store.dispatch(ConversationsActions.streamingChunk({
              conversationId,
              chunk: data.content,
            }));
          }
        } catch (e) {
          console.error('Error parsing event data:', e);
        }
      }
      return of();
    });
    
    // Process chunks
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = new TextDecoder().decode(value);
      parser.feed(text);
    }
    
    // Signal that streaming is complete
    return ConversationsActions.streamingEnd();
  } catch (error) {
    console.error('Error processing chat response:', error);
    return ConversationsActions.setError('Error processing response');
  }
};

export const conversationsEpic = combineEpics(
  sendMessageEpic
);
