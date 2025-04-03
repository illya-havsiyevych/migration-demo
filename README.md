# AI DIAL Chat React

This is a React implementation of the AI DIAL Chat application, migrated from the original Next.js application.
About migration process read [ClaudeCode](ClaudeCode.md).

## Features

### Foundation Features

- **Core Messaging System** - Chat interface with message exchange and streaming responses
- **Model Integration Layer** - Abstract interface for interacting with different AI models
- **Data Storage** - Browser-based storage for conversations and settings
- **UI Component Framework** - React components with React Router for navigation

### Extensions

- **Theming System** - Light and dark themes with customizable colors
- **Message Attachments** - Support for file attachments in conversations

## Technology Stack

- React 18
- Redux Toolkit for state management
- Redux Observable for side effects
- React Router for navigation
- TailwindCSS for styling
- TypeScript for type safety

## Configuration

The application uses environment variables for configuration:

- `VITE_DIAL_API_HOST` - Hostname for the DIAL API 
- `VITE_DIAL_API_KEY` - Authentication key for the DIAL API
- `VITE_DIAL_API_VERSION` - API version (default: "2023-03-15-preview")
- `VITE_DEFAULT_MODEL` - Default model ID (default: "gpt-35-turbo")

Create a `.env` file in the project root with these variables to configure the application:

## Setup

### Prerequisites

- Node.js (recommended: v18+)
- NPM (recommended: v9+)

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

### Build

```bash
npm run build
```

## API Layer

The application uses a client-side API layer that communicates with the server-side API. In production, this should be configured with a reverse proxy that forwards requests to the DIAL API, applying the appropriate authentication.

## License

See the LICENSE file for details.
