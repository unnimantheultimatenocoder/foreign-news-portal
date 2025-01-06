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

  // Handle HTTP client errors (like 404)
  if (error && typeof error === 'object' && 'error_type' in error) {
    const clientError = error as { message: string; error_type: string };
    return {
      code: clientError.error_type.toUpperCase(),
      message: 'Unable to fetch the requested resource. Please try again later.',
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