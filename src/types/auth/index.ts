import { AlertDefinition } from "@/lib/auth/alerts/auth-alerts"; // Importing the AlertDefinition type for alert-related data.
import { BaseFormState } from "../api"; // Importing the BaseFormState interface for form state structure.

// AuthFormState defines the state of a general authentication form (e.g., login, signup).
export interface AuthFormState extends BaseFormState {
  errors?: { // Specific errors related to the authentication form.
    fullName?: string; // Error related to the full name field.
    email?: string; // Error related to the email field.
    password?: string; // Error related to the password field.
    general?: string; // General error not tied to a specific field.
  };
  verificationPending?: boolean; // Indicates if email verification is pending.
  email?: string; // The email address associated with the form.
  alert?: AlertDefinition; // Optional alert definition for displaying alerts.
}

// ResetPasswordFormState defines the state of a reset password form.
export interface ResetPasswordFormState extends BaseFormState {
  errors?: { // Specific errors related to the reset password form.
    email?: string; // Error related to the email field.
    general?: string; // General error not tied to a specific field.
  };
}

// UpdatePasswordFormState defines the state of an update password form.
export interface UpdatePasswordFormState extends BaseFormState {
  errors?: { // Specific errors related to the update password form.
    password?: string; // Error related to the new password field.
    confirmPassword?: string; // Error related to the confirm password field.
    general?: string; // General error not tied to a specific field.
  };
}