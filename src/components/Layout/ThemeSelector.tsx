import React from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setCurrentTheme, themes, isLoading } = useTheme();

  if (isLoading) {
    return <div className="text-sm opacity-50">Loading themes...</div>;
  }

  return (
    <div className="relative">
      <select
        value={currentTheme}
        onChange={(e) => setCurrentTheme(e.target.value)}
        className="appearance-none rounded border border-base-300 bg-base-200 px-3 py-1 pr-8 text-neutral hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        aria-label="Select theme"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.displayName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ThemeSelector;