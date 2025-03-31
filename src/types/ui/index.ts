import type { AuthFormData } from "../api"; // Importing form data structure from the API types.
import type { AuthFormState } from "../auth"; // Importing form state structure from the auth types.

// Enums for Alert Types, Variants, and Statuses

// AlertType defines the type of alert (e.g., login, signup, etc.).
export enum AlertType {
  LOGIN = "LOGIN", // Alert for login-related actions.
  SIGNUP = "SIGNUP", // Alert for signup-related actions.
  VERIFICATION = "VERIFICATION", // Alert for verification-related actions.
  PASSWORD = "PASSWORD", // Alert for password-related actions.
  FORM = "FORM", // General form-related alert.
}

// AlertVariant defines the visual style of the alert.
export enum AlertVariant {
  WARNING = "warning", // Warning alert.
  CRITICAL = "destructive", // Critical or destructive alert.
  SUCCESS = "success", // Success alert.
  INFORMATION = "info", // Informational alert.
}

// AlertStatus defines the status of the alert (e.g., success, error, etc.).
export enum AlertStatus {
  SUCCESS = "SUCCESS", // Indicates a successful action.
  ERROR = "ERROR", // Indicates an error.
  WARNING = "WARNING", // Indicates a warning.
  INFO = "INFO", // Provides informational feedback.
}

// Interfaces for Alerts

// AlertAction defines an action that can be triggered from an alert.
export interface AlertAction {
  label: string; // The label for the action button.
  handler: () => void; // The function to execute when the action is triggered.
}

// AuthAlert defines the structure of an authentication-related alert.
export interface AuthAlert {
  type: AlertType; // The type of alert (e.g., LOGIN, SIGNUP).
  status: AlertStatus; // The status of the alert (e.g., SUCCESS, ERROR).
  title: string; // The title of the alert.
  message: string; // The message displayed in the alert.
  variant: AlertVariant; // The visual style of the alert.
  action?: AlertAction; // Optional action associated with the alert.
  duration?: number; // Optional duration (in milliseconds) for how long the alert is displayed.
  onDismiss?: () => void; // Optional callback when the alert is dismissed.
  persist?: boolean; // Whether the alert should persist until manually dismissed.
  resendVerificationEmail?: {
    // Optional resend verification email functionality.
    enabled: boolean; // Whether the resend functionality is enabled.
    email: string | null; // The email address to resend the verification to.
    onResendSuccess: (email: string) => void; // Callback for successful resend.
    onResendError: () => void; // Callback for resend failure.
  };
}

// Component Props Types

// AuthContentProps defines the props for an authentication content component.
export interface AuthContentProps {
  variant?: "default" | "forgot-password" | "reset-password"; // The variant of the content (e.g., default, forgot-password).
}

// LoginFormProps defines the props for a login form component.
export interface LoginFormProps {
  loginState: AuthFormState; // The state of the login form.
  loginAction: (formData: FormData) => Promise<void>; // The function to handle login form submission.
  formRef: React.RefObject<HTMLFormElement>; // A reference to the form element.
  formData: AuthFormData; // The data submitted in the login form.
  setFormData: (value: React.SetStateAction<AuthFormData>) => void; // Function to update the form data.
  loginErrors?: AuthFormState["errors"]; // Optional errors related to the login form.
}

// SignupFormProps defines the props for a signup form component.
export interface SignupFormProps {
  signupState: AuthFormState; // The state of the signup form.
  signupAction: (formData: FormData) => Promise<void>; // The function to handle signup form submission.
  formRef: React.RefObject<HTMLFormElement>; // A reference to the form element.
  formData: AuthFormData; // The data submitted in the signup form.
  setFormData: (value: React.SetStateAction<AuthFormData>) => void; // Function to update the form data.
  passwordError?: string; // Optional error related to the password field.
  setPasswordError: (error: string | undefined) => void; // Function to update the password error.
}

// Table Types

// DataTableRow defines the structure of a row in a data table.
export interface DataTableRow {
  microservice: string; // The name of the microservice.
  project: string; // The name of the project.
  status: string; // The status of the project or microservice.
  lastUpdated: string; // The last updated timestamp.
}

// Payment defines the structure of a payment object.
export type Payment = {
  id: string; // The unique identifier for the payment.
  amount: number; // The amount of the payment.
  status: "pending" | "processing" | "success" | "failed"; // The status of the payment.
  email: string; // The email address associated with the payment.
  qty: number; // The quantity of items in the payment.
};

// AlertState defines the state of alerts in the application.
export interface AlertState {
  error: string | null; // The error message, if any.
  message: string | null; // A general message, if any.
  signupState: Partial<AuthFormState>; // Partial state of the signup form.
  loginState: Partial<AuthFormState>; // Partial state of the login form.
  verificationState: {
    // State related to email verification.
    expired: boolean; // Whether the verification link has expired.
  };
  isPostSignup: boolean; // Whether the user is in the post-signup state.
  showVerificationAlert: boolean; // Whether to show the verification alert.
  email?: string | null; // The email address associated with the alert.
}

// EnhancedAlertProps defines the props for an enhanced alert component.
export interface EnhancedAlertProps {
  title?: string; // The title of the alert.
  message: string; // The message displayed in the alert.
  variant: AlertVariant; // The visual style of the alert.
  action?: {
    // Optional action associated with the alert.
    label: string; // The label for the action button.
    handler: () => void; // The function to execute when the action is triggered.
  };
  onClose?: () => void; // Optional callback when the alert is closed.
  className?: string; // Optional CSS class for the alert.
  showTitle?: boolean; // Whether to show the title of the alert.
  showCloseButton?: boolean; // Whether to show a close button (default: true).
  resendVerificationEmail?: {
    // Optional resend verification email functionality.
    enabled: boolean; // Whether the resend functionality is enabled.
    email: string | null; // The email address to resend the verification to.
    onResendSuccess?: (email: string) => void; // Callback for successful resend.
    onResendError?: () => void; // Callback for resend failure.
  };
}

// Additional Types

// AuthMode defines the modes for authentication (e.g., signin, signup).
// Add missing auth mode type
export type AuthMode = "signin" | "signup" | "reset" | "verify";

// SocialAuthButtonProps defines the props for a social authentication button.
export interface SocialAuthButtonProps {
  provider: "google" | "github" | "microsoft"; // The social authentication provider.
  loading?: boolean; // Whether the button is in a loading state.
  onClick?: () => void; // Optional click handler for the button.
}

// AuthAlertsProps defines the props for authentication-related alerts.
export interface AuthAlertsProps {
  error?: string | null; // The error message, if any.
  message?: string | null; // A general message, if any.
  verificationState: {
    // State related to email verification.
    expired: boolean; // Whether the verification link has expired.
  };
  showVerificationAlert: boolean; // Whether to show the verification alert.
  email?: string | null; // The email address associated with the alert.
  socialAuthState?: SocialAuthState; // The state of social authentication.
}

// SocialAuthState defines the state of social authentication.
export interface SocialAuthState {
  redirecting: boolean; // Whether the user is being redirected.
  provider?: "google" | "github" | "microsoft"; // The social authentication provider.
}
