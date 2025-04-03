import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ModelsActions } from '@/store/models/models.slice';
import { ConversationsActions } from '@/store/conversations/conversations.slice';

interface ModelSelectorProps {
  currentModelId?: string;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  currentModelId, 
  disabled = false 
}) => {
  const dispatch = useDispatch();
  const { models, isLoading } = useSelector((state: RootState) => state.models);
  const { currentConversationId } = useSelector((state: RootState) => state.conversations);

  useEffect(() => {
    // Fetch models if we don't have any
    if (models.length === 0 && !isLoading) {
      dispatch(ModelsActions.fetchModels());
    }
  }, [dispatch, models.length, isLoading]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    
    if (currentConversationId) {
      // Update existing conversation model
      dispatch(ConversationsActions.updateConversationModel({
        conversationId: currentConversationId,
        modelId
      }));
    }
  };

  return (
    <div className="flex items-center">
      <label htmlFor="model-selector" className="mr-2 text-sm font-medium">Model:</label>
      <select
        id="model-selector"
        className="rounded border border-neutral/20 bg-base-100 p-1 text-sm text-neutral focus:border-primary focus:outline-none"
        value={currentModelId}
        onChange={handleModelChange}
        disabled={disabled || isLoading || models.length === 0}
      >
        {isLoading ? (
          <option>Loading models...</option>
        ) : models.length === 0 ? (
          <option>No models available</option>
        ) : (
          models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name || model.id}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ModelSelector;