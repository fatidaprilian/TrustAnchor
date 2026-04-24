import { ERROR_CODES, type ErrorCode } from "@/modules/shared/errors/error-codes";

export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  public constructor(code: ErrorCode, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends ApplicationError {
  public constructor(message: string, details?: unknown) {
    super(ERROR_CODES.VALIDATION_ERROR, message, 400, details);
  }
}

export class AuthenticationError extends ApplicationError {
  public constructor(message = "Authentication failed") {
    super(ERROR_CODES.AUTHENTICATION_ERROR, message, 401);
  }
}

export class AuthorizationError extends ApplicationError {
  public constructor(message = "Insufficient permissions") {
    super(ERROR_CODES.AUTHORIZATION_ERROR, message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  public constructor(message = "Resource not found") {
    super(ERROR_CODES.NOT_FOUND_ERROR, message, 404);
  }
}

export class ConflictError extends ApplicationError {
  public constructor(message: string) {
    super(ERROR_CODES.CONFLICT_ERROR, message, 409);
  }
}

export class ConfigurationError extends ApplicationError {
  public constructor(message: string, details?: unknown) {
    super(ERROR_CODES.CONFIGURATION_ERROR, message, 500, details);
  }
}
