# AI DIAL Chat API Layer

## Overview

This document describes the internal API layer implementation for the AI DIAL Chat React application. The application uses a reverse proxy approach to handle API requests to the external DIAL API.

## Architecture

The architecture follows these principles:

1. Client-side application makes requests to internal API endpoints (`/api/*`)
2. Vite development server intercepts these requests and proxies them to the DIAL API
3. Sensitive credentials (API key, host) are only used at the proxy level, never exposed to the client
4. Response format is transformed as needed to match the application's expectations

## API Endpoints

### Models API

- **Endpoint**: `/api/models`
- **Method**: GET
- **Purpose**: Retrieves available AI models
- **Implementation**: Proxies to `${DIAL_API_HOST}/deployments` and transforms the response format

### Chat API

- **Endpoint**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "id": "conversation-id",
    "messages": [{ "role": "user", "content": "message" }],
    "model": { "id": "model-id" },
    "temperature": 1.0
  }
  ```
- **Purpose**: Sends a message to an AI model and receives a streaming response
- **Implementation**: Proxies to `${DIAL_API_HOST}/openai/deployments/${modelId}/chat/completions` with the appropriate transformation

## Configuration

The API layer is configured using environment variables:

- `VITE_DIAL_API_HOST`: The host URL for the DIAL API
- `VITE_DIAL_API_KEY`: The API key for authentication with the DIAL API
- `VITE_DIAL_API_VERSION`: The API version to use (defaults to "2025-01-01-preview")

These variables are loaded and used by the Vite development server but are not exposed to the client-side code.

## Production Deployment

For production deployment, a similar reverse proxy should be configured on the hosting environment. Options include:

1. Using a serverless function to handle API requests
2. Configuring an API gateway or reverse proxy in your hosting environment
3. Using a BFF (Backend for Frontend) pattern with a small server

The key requirement is maintaining the same API contract expected by the client application.

## Security Considerations

- API keys and secrets should never be exposed to the client
- All requests should be authenticated appropriately using the `Api-Key` header
- Consider rate limiting to prevent abuse
- Implement proper error handling for API failures

## Removed Features

The following features were explicitly removed from the API layer:

- `/api/themes` - Theming is now handled client-side only
- `/api/addons` - Addon support has been removed