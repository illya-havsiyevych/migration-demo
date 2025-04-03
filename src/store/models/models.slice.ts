import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DialAIEntityAddon, DialAIEntityModel } from '@/types/models';

export interface ModelsState {
  models: DialAIEntityModel[];
  addons: DialAIEntityAddon[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ModelsState = {
  models: [],
  addons: [],
  isLoading: false,
  error: null,
};

export const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    // Fetch models
    fetchModels: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchModelsSuccess: (state, action: PayloadAction<DialAIEntityModel[]>) => {
      state.models = action.payload;
      state.isLoading = false;
    },
    fetchModelsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Fetch addons
    fetchAddons: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAddonsSuccess: (state, action: PayloadAction<DialAIEntityAddon[]>) => {
      state.addons = action.payload;
      state.isLoading = false;
    },
    fetchAddonsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const ModelsActions = modelsSlice.actions;

export default modelsSlice.reducer;
