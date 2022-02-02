import { RequestError } from './request-error';

export class ValidationError extends RequestError {
  constructor(message: string, field: string | null = null, type: string | null = null) {
    let errorMessage = message;

    if (field && type) {
      errorMessage += `. Field '${field}' with type: '${type}'`;
    } else if (field) {
      errorMessage += `. Missing field: '${field}'`;
    }

    super(errorMessage, 422);
  }
}
