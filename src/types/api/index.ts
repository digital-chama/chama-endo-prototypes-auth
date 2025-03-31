// API-related types including form states and actions

// BaseFormState defines the structure of a form's state.
// It includes optional fields for errors, success status, loading state, and messages.
export interface BaseFormState {
  errors?: {
    // A dictionary of error messages, where the key is the field name.
    [key: string]: string | undefined; // The value is the error message or undefined.
  };
  success?: boolean; // Indicates whether the form submission was successful.
  loading?: boolean; // Indicates whether the form is currently loading.
  message?: string; // A general message related to the form state.
}

// SocialAuthResponse represents the response from a social authentication provider.
export interface SocialAuthResponse {
  provider: "google" | "github" | "microsoft"; // The social authentication provider.
  success: boolean; // Indicates whether the authentication was successful.
  error?: string; // An optional error message if the authentication failed.
  redirectUrl?: string; // An optional URL to redirect the user after authentication.
}

// AuthResponse represents the response from an authentication API.
export interface AuthResponse {
  success: boolean; // Indicates whether the authentication was successful.
  error?: string; // An optional error message if the authentication failed.
  redirectUrl?: string; // An optional URL to redirect the user after authentication.
  message?: string; // A general message related to the authentication response.
  verificationRequired?: boolean; // Indicates if email verification is required.
  user?: {
    // Optional user details included in the response.
    id: string | number; // The unique identifier for the user.
    email: string; // The email address of the user.
  };
}

// FormAction is a generic type for a function that handles form submissions.
// - T extends BaseFormState: The return type must extend BaseFormState.
// - The function accepts FormData as input and returns a Promise of type T.
export type FormAction<T extends BaseFormState = BaseFormState> = (
  formData: FormData
) => Promise<T>;

// AuthFormData defines the structure of form data for authentication-related actions.
// It includes fields for signup and login credentials, as well as dynamic key-value pairs.
export interface AuthFormData {
  signupEmail: string; // The email address for signup.
  signupPassword: string; // The password for signup.
  signupName: string; // The full name for signup.
  loginEmail: string; // The email address for login.
  loginPassword: string; // The password for login.
  [key: string]: string; // Allows additional dynamic key-value pairs.
}
