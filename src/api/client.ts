import { from, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { config } from '@/config';

// API error types
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// API client class with methods for making HTTP requests
export class ApiClient {
  // Get request
  get<T>(endpoint: string) {
    return from(
      fetch(`${config.apiHost}${endpoint}`)
    ).pipe(
      switchMap((response) => {
        if (!response.ok) {
          return from(response.text()).pipe(
            switchMap((text) => {
              // Try to parse error as JSON if possible
              try {
                const errorData = JSON.parse(text);
                return throwError(() => new ApiError(
                  errorData.error || errorData.message || response.statusText,
                  response.status,
                  errorData
                ));
              } catch (e) {
                // If not valid JSON, just use the text
                return throwError(() => new ApiError(text || response.statusText, response.status));
              }
            })
          );
        }
        return from(response.json() as Promise<T>);
      }),
      catchError((error) => {
        if (error instanceof ApiError) {
          return throwError(() => error);
        }
        return throwError(() => new ApiError(
          error.message || 'Unknown error',
          0
        ));
      })
    );
  }

  // Post request
  post<T>(endpoint: string, data: any) {
    return from(
      fetch(`${config.apiHost}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    ).pipe(
      switchMap((response) => {
        if (!response.ok) {
          return from(response.text()).pipe(
            switchMap((text) => {
              // Try to parse error as JSON if possible
              try {
                const errorData = JSON.parse(text);
                return throwError(() => new ApiError(
                  errorData.error || errorData.message || response.statusText,
                  response.status,
                  errorData
                ));
              } catch (e) {
                // If not valid JSON, just use the text
                return throwError(() => new ApiError(text || response.statusText, response.status));
              }
            })
          );
        }
        
        // Check if the response is streaming
        const contentType = response.headers.get('Content-Type');
        if (contentType?.includes('text/event-stream')) {
          return from(response);
        }
        
        return from(response.json() as Promise<T>);
      }),
      catchError((error) => {
        if (error instanceof ApiError) {
          return throwError(() => error);
        }
        return throwError(() => new ApiError(
          error.message || 'Unknown error',
          0
        ));
      })
    );
  }
  
  // Stream request for chat completions
  stream(endpoint: string, data: any) {
    // For chat completions to a specific model, we need to handle the path differently
    // The actual model is now handled by the server proxy 
    console.log(`Streaming to endpoint: ${config.apiHost}${endpoint}`);
    
    return from(
      fetch(`${config.apiHost}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    ).pipe(
      switchMap((response) => {
        if (!response.ok) {
          return from(response.text()).pipe(
            switchMap((text) => {
              // Try to parse error as JSON if possible
              try {
                const errorData = JSON.parse(text);
                return throwError(() => new ApiError(
                  errorData.error || errorData.message || response.statusText,
                  response.status,
                  errorData
                ));
              } catch (e) {
                // If not valid JSON, just use the text
                return throwError(() => new ApiError(text || response.statusText, response.status));
              }
            })
          );
        }
        
        // Return the raw Response object for streaming
        return of(response);
      }),
      catchError((error) => {
        if (error instanceof ApiError) {
          return throwError(() => error);
        }
        return throwError(() => new ApiError(
          error.message || 'Unknown error',
          0
        ));
      })
    );
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();
