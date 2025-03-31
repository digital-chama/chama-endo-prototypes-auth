// Core domain models and database entities

// BaseEntity is a foundational interface that defines common properties
// shared by all entities in the application.
export interface BaseEntity {
    id: string | number; // Unique identifier for the entity, can be a string or number.
    created_at?: string; // Optional timestamp for when the entity was created.
    updated_at?: string; // Optional timestamp for when the entity was last updated.
  }
  
  // User represents a user in the system. It extends BaseEntity to inherit
  // common properties like id, created_at, and updated_at.
  export interface User extends BaseEntity {
    full_name: string | null; // The full name of the user, or null if not provided.
    email: string | null; // The email address of the user, or null if not provided.
    avatar_url?: string | null; // Optional URL to the user's avatar image.
    role?: string | null; // Optional role of the user (e.g., "admin", "user").
    settings?: Json | null; // Optional user-specific settings stored as a JSON object.
  }
  
  // UserAuth represents authentication details for a user. It extends BaseEntity
  // to inherit common properties and adds fields specific to authentication.
  export interface UserAuth extends BaseEntity {
    user_id: string | number; // The ID of the user this authentication record belongs to.
    provider: "microsoft" | "google" | "github" | "email"; // The authentication provider.
    provider_user_id?: string; // Optional ID of the user in the provider's system.
    verified: boolean; // Indicates whether the user's authentication is verified.
  }
  
  // VerificationToken represents a token used for verification purposes,
  // such as email verification or password reset. It extends BaseEntity.
  export interface VerificationToken extends BaseEntity {
    user_id: string | number; // The ID of the user this token is associated with.
    token: string; // The actual token string.
    expires_at: string; // The timestamp when the token expires.
    type: "email" | "password_reset"; // The type of verification (e.g., email or password reset).
  }
  
  // Database represents the structure of the database. It defines the schema
  // for the public tables and their corresponding row types.
  export interface Database {
    public: { // Represents the public schema of the database.
      Tables: { // Contains all the tables in the public schema.
        users: { // Represents the "users" table.
          Row: User; // The structure of a row in the "users" table, which is the User interface.
          Insert: Omit<User, "created_up" | "updated_at">; // The structure for inserting a new user, excluding created_at and updated_at.
        };
      };
    };
  }
  
  // Json is a type that represents a JSON-compatible structure. It can be
  // a primitive value, null, or a nested object/array.
  export type Json =
    | string // A JSON string.
    | number // A JSON number.
    | boolean // A JSON boolean.
    | null // A JSON null value.
    | { [key: string]: Json } // A JSON object with string keys and JSON-compatible values.
    | Json[]; // A JSON array containing JSON-compatible values.
  
  // Tables is a utility type that extracts the row type of a specific table
  // from the Database interface. It uses a generic type parameter T.
  export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"];
  // - T: A generic type that must be a key of Database["public"]["Tables"] (e.g., "users").
  // - Result: The row type of the specified table (e.g., User for the "users" table).