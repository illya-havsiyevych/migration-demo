import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      {
        name: 'api-proxy',
        configureServer(server) {
          // Debug: Print the proxy configuration
          console.log(`Configuring proxy for DIAL API at ${env.VITE_DIAL_API_HOST || 'https://api.example.com'}`);
          
          // Create a proxy middleware instance with complete configuration
          const proxyMiddleware = createProxyMiddleware({
            target: env.VITE_DIAL_API_HOST || 'https://api.example.com',
            changeOrigin: true, // Important for handling external APIs
            secure: false, // Allow insecure certificates
            logLevel: 'debug', // Add logging for debugging
            onProxyReq: (proxyReq, req, res) => {
              // Add API key to outgoing request
              proxyReq.setHeader('Api-Key', env.VITE_DIAL_API_KEY || '');
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Accept', 'application/json');
            },
            pathRewrite: (path) => {
              console.log(`Rewriting path: ${path}`);
              
              // Handle specific endpoints
              if (path.startsWith('/api/models')) {
                return `/openai/deployments?api-version=${env.VITE_DIAL_API_VERSION || '2023-03-15-preview'}`;
              } else if (path.startsWith('/api/chat')) {
                // We need to extract the model ID from the request body
                // Since we can't easily do that here, we'll use a special URL format
                // The URL will be: /api/chat/{modelId} - with the modelId added by the client
                const parts = path.split('/');
                const modelId = parts[3] || env.VITE_DEFAULT_MODEL || 'gpt-35-turbo';
                console.log(`Chat request for model: ${modelId}`);
                return `/openai/deployments/${modelId}/chat/completions?api-version=${env.VITE_DIAL_API_VERSION || '2023-03-15-preview'}`;
              } else if (path.startsWith('/api/addons')) {
                return `/openai/addons?api-version=${env.VITE_DIAL_API_VERSION || '2023-03-15-preview'}`;
              } else {
                // Default for any other endpoints
                return path.replace(/^\/api/, '/openai') + `?api-version=${env.VITE_DIAL_API_VERSION || '2023-03-15-preview'}`;
              }
            },
            onError: (err, req, res) => {
              console.error('Proxy error:', err);
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ 
                error: 'Proxy Error', 
                message: err.message,
                details: 'Error connecting to the DIAL API. Please check your API configuration.'
              }));
            }
          });
          
          // Apply the proxy middleware to /api routes
          server.middlewares.use('/api', proxyMiddleware);
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    }
  };
});

