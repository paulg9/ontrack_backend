export class ValidationError extends Error {
  name = "ValidationError";
}

export class PreconditionError extends Error {
  name = "PreconditionError";
}

export class ConflictError extends Error {
  name = "ConflictError";
}

export class NotFoundError extends Error {
  name = "NotFoundError";
}