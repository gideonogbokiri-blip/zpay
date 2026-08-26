export type ApiErrorKind =
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'insufficient_funds'
  | 'provider_failure'
  | 'network'
  | 'timeout'
  | 'unexpected';

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorShape {
  code: string;
  message: string;
  fieldErrors?: FieldError[];
  requestId?: string;
  retryable: boolean;
  data?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly code: string;
  readonly fieldErrors: FieldError[];
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly data?: unknown;

  constructor(shape: ApiErrorShape, kind: ApiErrorKind) {
    super(shape.message);
    this.name = 'ApiError';
    this.kind = kind;
    this.code = shape.code;
    this.fieldErrors = shape.fieldErrors ?? [];
    this.requestId = shape.requestId;
    this.retryable = shape.retryable;
    this.data = shape.data;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof TypeError) {
    return new ApiError(
      { code: 'NETWORK_ERROR', message: 'Unable to reach the server. Check your connection and try again.', retryable: true },
      'network'
    );
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return new ApiError(
    { code: 'UNEXPECTED', message, retryable: false },
    'unexpected'
  );
}

export function isInsufficientFunds(error: unknown): error is ApiError {
  return error instanceof ApiError && error.kind === 'insufficient_funds';
}