// App configuration

// Default values that will be used if environment variables are not provided
const DEFAULT_API_VERSION = '2025-01-01-preview';
const DEFAULT_MODEL = 'gpt-35-turbo';

// Configuration object that will be used throughout the application
export const config = {
  // API configuration
  apiHost: '/api', // This will be proxied to the actual API host
  apiVersion: import.meta.env.VITE_DIAL_API_VERSION || DEFAULT_API_VERSION,
  defaultModel: import.meta.env.VITE_DEFAULT_MODEL || DEFAULT_MODEL,
  
  // UI configuration
  appName: 'AI DIAL Chat',
  defaultSystemPrompt: '',
  defaultTemperature: Number(import.meta.env.VITE_DEFAULT_TEMPERATURE || 1.0),
  footerHtmlMessage: '',
  codeWarning: 'Full responsibility for code correctness, security and licensing lies solely with the user.',
  enabledFeatures: [
    'conversations-section',
    'prompts-section',
    'top-settings',
    'top-clear-conversation',
    'input-files',
    'attachments-manager',
  ],
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: string): boolean => {
  return config.enabledFeatures.includes(feature);
};

// Initialize configuration with values from window object if available
export const initializeConfig = (): void => {
  const configFromWindow = (window as any).__APP_CONFIG__;
  
  if (configFromWindow) {
    Object.assign(config, {
      apiVersion: configFromWindow.DIAL_API_VERSION || config.apiVersion,
      defaultModel: configFromWindow.DEFAULT_MODEL || config.defaultModel,
      appName: configFromWindow.APP_NAME || config.appName,
      defaultSystemPrompt: configFromWindow.DEFAULT_SYSTEM_PROMPT || config.defaultSystemPrompt,
      defaultTemperature: configFromWindow.DEFAULT_TEMPERATURE !== undefined
        ? parseFloat(configFromWindow.DEFAULT_TEMPERATURE)
        : config.defaultTemperature,
      footerHtmlMessage: configFromWindow.FOOTER_HTML_MESSAGE || config.footerHtmlMessage,
      codeWarning: configFromWindow.CODE_GENERATION_WARNING || config.codeWarning,
      enabledFeatures: configFromWindow.ENABLED_FEATURES
        ? configFromWindow.ENABLED_FEATURES.split(',')
        : config.enabledFeatures,
    });
  }
};