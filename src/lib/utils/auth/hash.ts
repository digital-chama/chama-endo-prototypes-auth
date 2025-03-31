import crypto from "node:crypto"; // Importing the crypto module for password hashing and verification.

/**
 * Hashes a user's password using the scrypt algorithm.
 * @param password - The plain text password to be hashed.
 * @returns A string containing the hashed password and the salt, separated by a colon.
 */
export function hashUserPassword(password: string): string {
  // Generate a random 16-byte salt and convert it to a hexadecimal string.
  const salt = crypto.randomBytes(16).toString("hex");

  // Hash the password using the scrypt algorithm with the generated salt.
  const hashedPassword = crypto.scryptSync(password, salt, 64);

  // Return the hashed password and salt, separated by a colon.
  return hashedPassword.toString("hex") + ":" + salt;
}

/**
 * Verifies a supplied password against a stored hashed password.
 * @param storedPassword - The stored hashed password (format: "hashedPassword:salt").
 * @param suppliedPassword - The plain text password to verify.
 * @returns A boolean indicating whether the supplied password matches the stored password.
 */
export function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): boolean {
  // Split the stored password into its hashed password and salt components.
  const [hashedPassword, salt] = storedPassword.split(":");

  // Convert the hashed password from hexadecimal to a Buffer.
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");

  // Hash the supplied password using the same salt.
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);

  // Compare the hashed supplied password with the stored hashed password using a timing-safe comparison.
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
