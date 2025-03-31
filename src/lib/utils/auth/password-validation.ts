/**
 * Validates whether a given password meets the required security criteria.
 * @param password - The password to validate.
 * @returns A boolean indicating whether the password is valid.
 *
 * Validation Criteria:
 * - Must be at least 12 characters long.
 * - Must not exceed 123 characters.
 * - Must contain at least one lowercase letter (a-z).
 * - Must contain at least one uppercase letter (A-Z).
 * - Must contain at least one numeric digit (0-9).
 * - Must contain at least one special character (!@#$%^&*).
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 12 && // Check if the password is at least 12 characters long.
    password.length <= 123 && // Check if the password does not exceed 123 characters.
    /[a-z]/.test(password) && // Check if the password contains at least one lowercase letter.
    /[A-Z]/.test(password) && // Check if the password contains at least one uppercase letter.
    /[0-9]/.test(password) && // Check if the password contains at least one numeric digit.
    /[!@#$%^&*]/.test(password) // Check if the password contains at least one special character.
  );
}
