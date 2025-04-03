# AI DIAL Chat Theming System

## Overview

The AI DIAL Chat application includes a client-side theming system that allows users to customize the appearance of the application. This document describes how the theming system works and how to extend it.

## Theme Structure

Each theme is defined by the following properties:

```typescript
interface Theme {
  displayName: string;        // Human-readable name
  colors: Record<string, string>; // CSS variables for colors
  topicColors: Record<string, string>; // Colors for topic tags
  'app-logo': string;         // Path to logo image
  'font-family'?: string;     // Font family for text
  'font-codeblock'?: string;  // Font family for code blocks
  id: string;                 // Unique identifier
}
```

## Default Themes

The application includes the following built-in themes:

1. **Light** - Default light theme
2. **Dark** - Dark theme for low-light environments
3. **High Contrast** - Theme with high contrast colors for accessibility
4. **Solarized** - Theme based on the Solarized color scheme

## Theme Implementation

The theming system is implemented using:

1. **React Context** - `ThemeContext` provides theme data and functionality to the application
2. **CSS Variables** - Themes are applied using CSS variables
3. **LocalStorage** - User theme preference is saved in localStorage
4. **System Preference Detection** - Automatically uses dark theme if the system prefers it

## How Themes Are Applied

Themes are applied through the following process:

1. The `ThemeProvider` component initializes theme state
2. When a theme is selected, CSS variables are set on the document root
3. CSS classes are applied to the HTML element based on the active theme
4. Components use Tailwind CSS classes that reference these CSS variables

## Theme Selector

A `ThemeSelector` component is provided to allow users to switch between available themes. This component is located in the application header.

## Adding New Themes

To add a new theme:

1. Add a new theme definition to the `defaultThemes` array in `ThemeContext.tsx`
2. Define all required color variables and properties
3. Add a corresponding CSS class in `index.css` for fallback purposes
4. Add any required assets (like logos) to the public folder

## CSS Variable Reference

The following CSS variables are used by the theming system:

- `--primary`: Primary color for buttons and important elements
- `--secondary`: Secondary color for less important elements
- `--accent`: Accent color for highlights
- `--neutral`: Color for neutral text and borders
- `--base-100`: Main background color
- `--base-200`: Secondary background color
- `--base-300`: Tertiary background color
- `--info`: Color for informational elements
- `--success`: Color for success states
- `--warning`: Color for warning states
- `--error`: Color for error states
- `--font-family`: Font family for text
- `--font-codeblock`: Font family for code blocks