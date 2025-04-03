import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemesConfig } from '@/types/themes';

interface ThemeContextProps {
  currentTheme: string;
  setCurrentTheme: (themeName: string) => void;
  themes: Theme[];
  isLoading: boolean;
  error: string | null;
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 'light',
  setCurrentTheme: () => {},
  themes: [],
  isLoading: false,
  error: null,
});

// Default themes
// Add a new theme called "Terminal"
const defaultThemes: Theme[] = [
  {
    id: 'light',
    displayName: 'Light',
    colors: {
      '--primary': '#0057b7',
      '--secondary': '#505a64',
      '--accent': '#f1f5f9',
      '--neutral': '#475569',
      '--base-100': '#ffffff',
      '--base-200': '#f8fafc',
      '--base-300': '#e2e8f0',
      '--info': '#0284c7',
      '--success': '#16a34a',
      '--warning': '#d97706',
      '--error': '#b91c1c',
      '--message-user-bg': '#e2e8f0',   /* User message background */
      '--message-user-text': '#0f172a', /* User message text */
      '--message-ai-bg': '#f1f5f9',     /* AI message background */
      '--message-ai-text': '#0f172a',   /* AI message text */
    },
    topicColors: {
      'Business': '#4285F4',
      'Development': '#34A853',
      'User Experience': '#FBBC05',
      'Analysis': '#EA4335',
      'SQL': '#16537E',
      'SDLC': '#6B7280',
    },
    'app-logo': '/logo-light.svg',
    'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'font-codeblock': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: 'dark',
    displayName: 'Dark',
    colors: {
      '--primary': '#60a5fa',
      '--secondary': '#94a3b8',
      '--accent': '#334155',
      '--neutral': '#f1f5f9', /* Lighter text color for better contrast */
      '--base-100': '#0f172a',
      '--base-200': '#1e293b',
      '--base-300': '#334155',
      '--info': '#38bdf8',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--message-user-bg': '#334155',   /* User message background */
      '--message-user-text': '#ffffff', /* User message text - pure white for maximum contrast */
      '--message-ai-bg': '#1e293b',     /* AI message background */
      '--message-ai-text': '#ffffff',   /* AI message text - pure white for maximum contrast */
    },
    topicColors: {
      'Business': '#4285F4',
      'Development': '#34A853',
      'User Experience': '#FBBC05',
      'Analysis': '#EA4335',
      'SQL': '#16537E',
      'SDLC': '#6B7280',
    },
    'app-logo': '/logo-dark.svg',
    'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'font-codeblock': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: 'high-contrast',
    displayName: 'High Contrast',
    colors: {
      '--primary': '#ffcd00',
      '--secondary': '#ffffff',
      '--accent': '#333333',
      '--neutral': '#ffffff',
      '--base-100': '#000000',
      '--base-200': '#0a0a0a',
      '--base-300': '#1a1a1a',
      '--info': '#00e5ff',
      '--success': '#00ff66',
      '--warning': '#ffe100',
      '--error': '#ff2d2d',
      '--message-user-bg': '#2a2a2a',   /* User message background */
      '--message-user-text': '#ffffff', /* User message text */
      '--message-ai-bg': '#1a1a1a',     /* AI message background */
      '--message-ai-text': '#ffffff',   /* AI message text */
    },
    topicColors: {
      'Business': '#ffdd00',
      'Development': '#00ff00',
      'User Experience': '#ffff00',
      'Analysis': '#ff0000',
      'SQL': '#00ffff',
      'SDLC': '#ffffff',
    },
    'app-logo': '/logo-dark.svg',
    'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'font-codeblock': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: 'solarized',
    displayName: 'Solarized',
    colors: {
      '--primary': '#268bd2', // Blue
      '--secondary': '#2aa198', // Cyan
      '--accent': '#eee8d5', // Base2
      '--neutral': '#586e75', // Base01 (for better contrast)
      '--base-100': '#fdf6e3', // Base3 (background)
      '--base-200': '#eee8d5', // Base2
      '--base-300': '#93a1a1', // Base1
      '--info': '#2aa198', // Cyan
      '--success': '#859900', // Green
      '--warning': '#b58900', // Yellow
      '--error': '#dc322f', // Red
      '--message-user-bg': '#eee8d5',   /* User message background - Base2 */
      '--message-user-text': '#073642', /* User message text - Base02 */
      '--message-ai-bg': '#fdf6e3',     /* AI message background - Base3 */
      '--message-ai-text': '#073642',   /* AI message text - Base02 */
    },
    topicColors: {
      'Business': '#268bd2', // Blue
      'Development': '#859900', // Green
      'User Experience': '#b58900', // Yellow
      'Analysis': '#dc322f', // Red
      'SQL': '#6c71c4', // Violet
      'SDLC': '#d33682', // Magenta
    },
    'app-logo': '/logo-light.svg',
    'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'font-codeblock': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: 'terminal',
    displayName: 'Terminal',
    colors: {
      '--primary': '#00ff00', // Bright green
      '--secondary': '#aaaaaa', // Light gray
      '--accent': '#222222', // Dark gray
      '--neutral': '#00ff00', // Bright green (same as primary)
      '--base-100': '#000000', // Black
      '--base-200': '#111111', // Very dark gray
      '--base-300': '#222222', // Dark gray
      '--info': '#0099ff', // Bright blue
      '--success': '#00ff00', // Bright green
      '--warning': '#ffff00', // Bright yellow
      '--error': '#ff0000', // Bright red
      '--message-user-bg': '#222222',   /* User message background */
      '--message-user-text': '#00ff00', /* User message text - terminal green */
      '--message-ai-bg': '#111111',     /* AI message background */
      '--message-ai-text': '#ffffff',   /* AI message text - pure white for maximum contrast */
    },
    topicColors: {
      'Business': '#00ffff', // Cyan
      'Development': '#00ff00', // Green
      'User Experience': '#ffff00', // Yellow
      'Analysis': '#ff0000', // Red
      'SQL': '#0099ff', // Blue
      'SDLC': '#aaaaaa', // Gray
    },
    'app-logo': '/logo-dark.svg',
    'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    'font-codeblock': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
];

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load theme from localStorage if available
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Try to load the preferred theme from localStorage
      const savedTheme = localStorage.getItem('preferred-theme');
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      } else {
        // If no saved theme, check for system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(prefersDark ? 'dark' : 'light');
      }
      
      // Apply default themes
      setThemes(defaultThemes);
    } catch (err) {
      console.error('Failed to initialize themes:', err);
      setError('Failed to initialize themes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const theme = themes.find((t) => t.id === currentTheme);
    if (theme) {
      // Apply CSS variables to document root
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });

      // Add/remove theme classes for HTML element
      document.documentElement.classList.remove('dark', 'high-contrast', 'solarized', 'terminal');
      if (currentTheme !== 'light') {
        document.documentElement.classList.add(currentTheme);
      }

      // Apply font family if specified
      if (theme['font-family']) {
        document.documentElement.style.setProperty('--font-family', theme['font-family']);
      }
      if (theme['font-codeblock']) {
        document.documentElement.style.setProperty('--font-codeblock', theme['font-codeblock']);
      }
      
      // Save current theme preference to localStorage
      try {
        localStorage.setItem('preferred-theme', currentTheme);
      } catch (e) {
        console.warn('Could not save theme preference to localStorage', e);
      }
    }
  }, [currentTheme, themes]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        themes,
        isLoading,
        error,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
