import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UIState {
  isMobileMenuOpen: boolean;
  showSettings: boolean;
  showModels: boolean;
  showAttachments: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  showSettings: false,
  showModels: false,
  showAttachments: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings;
    },
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    toggleModels: (state) => {
      state.showModels = !state.showModels;
    },
    setShowModels: (state, action: PayloadAction<boolean>) => {
      state.showModels = action.payload;
    },
    toggleAttachments: (state) => {
      state.showAttachments = !state.showAttachments;
    },
    setShowAttachments: (state, action: PayloadAction<boolean>) => {
      state.showAttachments = action.payload;
    },
  },
});

export const UIActions = uiSlice.actions;

export default uiSlice.reducer;
