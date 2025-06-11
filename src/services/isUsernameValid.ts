import validator from 'validator';
import { ValidatedInputCheckValidityReturn } from '../utils/useValidatedInput';

export function isUsernameValid(
  username: string
): ValidatedInputCheckValidityReturn {
  if (!validator.isAlphanumeric(username)) {
    return { valid: false, message: 'Username must be alphanumeric' };
  } else {
    return { valid: true };
  }
}
