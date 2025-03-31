// FullUser represents a user entity with basic details.
// This interface is used to define the structure of a user object in the application.
export interface FullUser {
    id: string | number; // Unique identifier for the user, can be a string or number.
    full_name: string | null; // The full name of the user, or null if not provided.
    email: string | null; // The email address of the user, or null if not provided.
    avatar_url?: string; // Optional URL to the user's avatar image.
  }