export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  console.error('API Error:', error);

  // Handle URL-related errors
  if (error instanceof TypeError && error.message.includes('URL')) {
    return {
      code: 'INVALID_URL',
      message: 'Invalid URL format or network error',
      details: { originalError: error.message },
    };
  }

  // Handle HTTP client errors (like 404)
  if (error && typeof error === 'object' && 'error_type' in error) {
    const clientError = error as { message: string; error_type: string };
    return {
      code: clientError.error_type.toUpperCase(),
      message: clientError.message,
      details: { originalError: error },
    };
  }

  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
};