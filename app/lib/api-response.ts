/**
 * Standardized API Response Types
 *
 * Provides consistent response formatting across all API endpoints.
 * Includes success and error response helpers.
 */

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    field?: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    meta?: ApiSuccessResponse<T>["meta"];
    status?: number;
    headers?: HeadersInit;
  }
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message && { message: options.message }),
    ...(options?.meta && { meta: options.meta }),
  };

  return Response.json(response, {
    status: options?.status || 200,
    headers: options?.headers,
  });
}

export function errorResponse(
  message: string,
  options?: {
    code?: string;
    field?: string;
    details?: unknown;
    status?: number;
    headers?: HeadersInit;
  }
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message,
      ...(options?.code && { code: options.code }),
      ...(options?.field && { field: options.field }),
      ...(options?.details && { details: options.details }),
    },
  };

  return Response.json(response, {
    status: options?.status || 400,
    headers: options?.headers,
  });
}

export function notFoundResponse(message: string = "Resource not found"): Response {
  return errorResponse(message, {
    code: "NOT_FOUND",
    status: 404,
  });
}

export function unauthorizedResponse(message: string = "Unauthorized"): Response {
  return errorResponse(message, {
    code: "UNAUTHORIZED",
    status: 401,
  });
}

export function forbiddenResponse(message: string = "Forbidden"): Response {
  return errorResponse(message, {
    code: "FORBIDDEN",
    status: 403,
  });
}

export function validationErrorResponse(
  message: string,
  details?: unknown
): Response {
  return errorResponse(message, {
    code: "VALIDATION_ERROR",
    status: 422,
    details,
  });
}

export function serverErrorResponse(
  message: string = "Internal server error",
  details?: unknown
): Response {
  const isDevelopment = process.env.NODE_ENV === "development";

  return errorResponse(message, {
    code: "INTERNAL_ERROR",
    status: 500,
    ...(isDevelopment && details && { details }),
  });
}

export async function parseApiResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Request failed" } }));
    throw new Error(error.error?.message || "Request failed");
  }

  const data = await response.json();

  if ("success" in data && data.success === false) {
    throw new Error(data.error?.message || "Request failed");
  }

  return data.data || data;
}
