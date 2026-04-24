import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ApplicationError, ValidationError } from "@/modules/shared/errors/application-error";
import { ERROR_CODES } from "@/modules/shared/errors/error-codes";
import { logger } from "@/modules/shared/logging/logger";

export function jsonSuccess<TPayload>(payload: TPayload, statusCode = 200): NextResponse {
  return NextResponse.json(payload, { status: statusCode });
}

export function normalizeError(error: unknown): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ValidationError("One or more fields are invalid", error.flatten().fieldErrors);
  }

  return new ApplicationError(ERROR_CODES.INTERNAL_ERROR, "An unexpected error occurred", 500);
}

export async function handleRoute<TPayload>(
  actionName: string,
  handler: () => Promise<NextResponse<TPayload> | NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    const traceId = randomUUID();
    const normalizedError = normalizeError(error);

    logger.error(
      {
        actionName,
        code: normalizedError.code,
        details: normalizedError.details,
        statusCode: normalizedError.statusCode,
        traceId
      },
      normalizedError.message
    );

    return NextResponse.json(
      {
        error: {
          code: normalizedError.code,
          message: normalizedError.message,
          details: normalizedError.statusCode === 400 ? normalizedError.details : undefined,
          traceId
        }
      },
      { status: normalizedError.statusCode }
    );
  }
}
