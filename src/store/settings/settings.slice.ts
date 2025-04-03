import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StorageType } from '@/types/storage';
import { Theme } from '@/types/themes';
import { config } from '@/config';

export interface SettingsState {
  appName: string;
  isAuthDisabled: boolean;
  footerHtmlMessage: string;
  enabledFeatures: string[];
  codeWarning: string;
  defaultModelId: string | undefined;
  defaultTemperature: number;
  storageType: StorageType;
  themes: Theme[];
  currentTheme: string;
}

const initialState: SettingsState = {
  appName: config.appName,
  isAuthDisabled: true,
  footerHtmlMessage: config.footerHtmlMessage,
  enabledFeatures: config.enabledFeatures,
  codeWarning: config.codeWarning,
  defaultModelId: config.defaultModel,
  defaultTemperature: config.defaultTemperature,
  storageType: StorageType.BrowserStorage,
  themes: [],
  currentTheme: 'light',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    initSettings: (state) => state,
    setAppName: (state, { payload }: PayloadAction<string>) => {
      state.appName = payload;
    },
    setFooterHtmlMessage: (state, { payload }: PayloadAction<string>) => {
      state.footerHtmlMessage = payload;
    },
    setEnabledFeatures: (state, { payload }: PayloadAction<string[]>) => {
      state.enabledFeatures = payload;
    },
    setCodeWarning: (state, { payload }: PayloadAction<string>) => {
      state.codeWarning = payload;
    },
    setDefaultModelId: (state, { payload }: PayloadAction<string>) => {
      state.defaultModelId = payload;
    },
    setDefaultTemperature: (state, { payload }: PayloadAction<number>) => {
      state.defaultTemperature = payload;
    },
    setStorageType: (state, { payload }: PayloadAction<StorageType>) => {
      state.storageType = payload;
    },
    setThemes: (state, { payload }: PayloadAction<Theme[]>) => {
      state.themes = payload;
    },
    setCurrentTheme: (state, { payload }: PayloadAction<string>) => {
      state.currentTheme = payload;
    },
  },
});

export const SettingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
