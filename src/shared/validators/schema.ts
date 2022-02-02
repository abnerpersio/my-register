import { ValidationError } from '../errors/validation-error';

const VALIDATION_MESSAGE = 'Invalid payload';

export interface IValidation {
  [key: string]: string;
}

export default function Validate(params: { [key: string]: any }, validations: IValidation) {
  for (const key of Object.keys(validations)) {
    if (!params[key]) throw new ValidationError(VALIDATION_MESSAGE, key);

    if (typeof params[key] !== validations[key])
      throw new ValidationError(VALIDATION_MESSAGE, key, typeof params[key]);
  }
}
