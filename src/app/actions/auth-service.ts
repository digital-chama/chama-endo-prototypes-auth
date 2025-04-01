"use server"; // Indicates that this function is executed on the server side.

import { cookies } from "next/headers"; // Importing cookies utility from Next.js for handling cookies.
import { createClient } from "@/lib/utils/db/supabase/server"; // Importing the function to create a Supabase client.
import { isValidPassword } from "@/lib/utils/auth/password-validation"; // Importing the password validation utility.
import { AUTH_ALERTS } from "@/lib/auth/alerts/auth-alerts"; // Importing predefined alert messages for validation errors.
import {
  AuthFormState,
  ResetPasswordFormState,
  UpdatePasswordFormState,
} from "@/types/auth"; // Importing the type for authentication form state.

/**
 * Handles new user registration.
 * Validates inputs, checks for existing accounts, and initiates email verification.
 *
 * @param prevState - The previous state of the authentication form.
 * @param formData - The form data submitted by the user.
 * @returns A promise resolving to the updated authentication form state.
 */
export async function signup(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  cookies(); // Access cookies (required for Supabase authentication).

  // Extract form data fields (fullName, email, password) from the submitted form.
  const fullName = formData.get("fullName") as string; // The user's full name.
  const email = formData.get("email") as string; // The user's email address.
  const password = formData.get("password") as string; // The user's password.

  // Initialize an object to store validation errors.
  const errors: AuthFormState["errors"] = {};

  // Validate the full name field.
  if (!fullName || fullName.trim().length < 2) {
    errors.fullName = AUTH_ALERTS.FORM.VALIDATION.FULL_NAME_REQUIRED.message;
  }

  // Validate the email field.
  if (!email || !email.includes("@")) {
    errors.email = AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message;
  }

  // Validate the password field using the isValidPassword utility.
  if (!isValidPassword(password)) {
    errors.password = AUTH_ALERTS.FORM.VALIDATION.PASSWORD_REQUIREMENTS.message;
  }

  // If there are any validation errors, return the errors in the form state.
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient(); // Create a Supabase client instance.

  try {
    // Check if the email is already registered using the `check_user_status` RPC.
    const { data: statusData, error: statusError } = await supabase.rpc(
      "check_user_status",
      {
        email_to_check: email,
      }
    );

    // Handle errors from the RPC call.
    if (statusError) {
      console.error("Error checking user status:", statusError);
      return {
        errors: {
          general: AUTH_ALERTS.SIGNUP.ERROR.message,
        },
        success: false,
      };
    }

    // If the email is already registered, return an appropriate error message.
    if (statusData?.exists) {
      return {
        errors: {
          email: statusData.is_verified
            ? AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS.message // Account already exists and is verified.
            : AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED.message, // Account exists but is unverified.
        },
        verificationPending: !statusData.is_verified, // Indicate if verification is pending.
        email: email, // Include the email in the response.
        success: false,
        alert: statusData.is_verified
          ? AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS // Alert for verified account.
          : AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED, // Alert for unverified account.
      };
    }

    // Proceed with signup for a new user.
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    ); // Construct the email verification callback URL.
    redirectUrl.searchParams.set("email_verify", email); // Add the email as a query parameter.

    // Create a new user in Supabase and send an email verification link.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.toString(), // Set the email verification redirect URL.
        data: {
          full_name: fullName, // Include the user's full name in the metadata.
        },
      },
    });

    // Handle errors during the signup process.
    if (error) {
      return {
        errors: {
          general: AUTH_ALERTS.SIGNUP.ERROR.message, // General signup error message.
        },
        success: false,
      };
    }

    // Return a success response if the signup is successful.
    return {
      success: true,
      message: AUTH_ALERTS.SIGNUP.SUCCESS.message, // Success message.
      email: email, // Include the email in the response.
    };
  } catch (err) {
    // Handle unexpected errors during the signup process.
    console.error("Signup error:", err);
    return {
      errors: {
        general: AUTH_ALERTS.SIGNUP.ERROR.message, // General error message.
      },
      success: false,
    };
  }
}

/**
 * Handles user login attempts
 * Validates credentials and manages authentication state
 */
/**
 * Handles user login attempts.
 * This function validates the user's credentials, interacts with the Supabase authentication service,
 * and manages the authentication state based on the login attempt's outcome.
 *
 * @param prevState - The previous state of the authentication form, used to maintain state consistency.
 * @param formData - The form data submitted by the user, containing email and password fields.
 * @returns A promise resolving to the updated authentication form state, including success, errors, or loading status.
 */
export async function login(
  prevState: AuthFormState, // Previous state of the form, used for state management.
  formData: FormData // Form data containing user inputs (email and password).
): Promise<AuthFormState> {
  console.log("Server login action started"); // Log the start of the login process.

  cookies(); // Access cookies (required for Supabase authentication).

  // Extract the email and password from the submitted form data.
  const email = formData.get("email") as string; // User's email address.
  const password = formData.get("password") as string; // User's password.

  console.log("Login attempt for email:", email); // Log the email being used for login.

  // Validate the email input.
  if (!email || !email.includes("@")) {
    // If the email is missing or invalid, return an error state.
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message, // Predefined error message for invalid email.
      },
      loading: false, // Indicate that the form is no longer loading.
    };
  }

  // Validate the password input.
  if (!password) {
    // If the password is missing, return an error state.
    return {
      errors: {
        password: AUTH_ALERTS.FORM.VALIDATION.PASSWORD_REQUIREMENTS.message, // Predefined error message for missing password.
      },
      loading: false, // Indicate that the form is no longer loading.
    };
  }

  try {
    // Create a Supabase client instance to interact with the authentication service.
    const supabase = await createClient();
    console.log("Supabase client created"); // Log the successful creation of the Supabase client.

    // Attempt to sign in the user with the provided email and password.
    const { error: authError } = await supabase.auth.signInWithPassword({
      email, // User's email address.
      password, // User's password.
    });
    console.log("Auth response received:", authError ? "error" : "success"); // Log the result of the authentication attempt.

    // Handle authentication errors.
    if (authError) {
      // Check if the error is due to an unconfirmed email.
      if (authError.code === "email_not_confirmed") {
        return {
          errors: {
            general: "email_not_confirmed", // Indicate that the email is not confirmed.
          },
          verificationPending: true, // Indicate that email verification is pending.
          email: email, // Include the email in the response for reference.
          loading: false, // Indicate that the form is no longer loading.
        };
      }

      // For other authentication errors, return a general error message.
      return {
        errors: {
          general: AUTH_ALERTS.LOGIN.ERROR.message, // Predefined general login error message.
        },
        loading: false, // Indicate that the form is no longer loading.
      };
    }

    // If the login is successful, return a success state.
    return {
      success: true, // Indicate that the login was successful.
      loading: false, // Indicate that the form is no longer loading.
      message: AUTH_ALERTS.LOGIN.SUCCESS.message, // Predefined success message.
    };
  } catch (err) {
    // Handle unexpected errors during the login process.
    console.error("Login server error:", err); // Log the error for debugging purposes.

    // Return a general error state.
    return {
      errors: {
        general: AUTH_ALERTS.LOGIN.ERROR.message, // Predefined general login error message.
      },
      loading: false, // Indicate that the form is no longer loading.
    };
  }
}

/**
 * Combined authentication handler for login and signup.
 * This function determines the authentication mode (login or signup) and routes the request
 * to the appropriate handler (`login` or `signup`).
 *
 * @param mode - The authentication mode, either "login" or "signup".
 * @param prevState - The previous state of the authentication form, used to maintain state consistency.
 * @param formData - The form data submitted by the user, containing relevant fields for login or signup.
 * @returns A promise resolving to the updated authentication form state, including success, errors, or loading status.
 */
export async function auth(
  mode: "login" | "signup", // Specifies whether the user is attempting to log in or sign up.
  prevState: AuthFormState, // The previous state of the authentication form.
  formData: FormData // The form data submitted by the user.
): Promise<AuthFormState> {
  // Check the mode and route to the appropriate handler.
  if (mode === "login") {
    // If the mode is "login", call the `login` function with the provided state and form data.
    return login(prevState, formData);
  }

  // If the mode is "signup", call the `signup` function with the provided state and form data.
  return signup(prevState, formData);
}

/**
 * Handles resending verification emails
 * Uses signup flow as PKCE workaround for consistent token format
 */

/**
 * Handles resending verification emails.
 * This function uses a workaround to maintain PKCE (Proof Key for Code Exchange) flow consistency
 * by leveraging the `signUp` method instead of the `resend` method, ensuring consistent token formats.
 *
 * @param prevState - The previous state of the authentication form, used to maintain state consistency.
 * @param formData - The form data submitted by the user, containing the email field.
 * @returns A promise resolving to the updated authentication form state, including success, errors, or loading status.
 */
export async function resendVerification(
  prevState: AuthFormState, // The previous state of the authentication form.
  formData: FormData // The form data submitted by the user, containing the email field.
): Promise<AuthFormState> {
  // Extract the email from the form data.
  const email = formData.get("email") as string;

  // Validate the email input.
  if (!email || !email.includes("@")) {
    // If the email is missing or invalid, return an error state.
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message, // Predefined error message for invalid email.
      },
    };
  }

  // Create a Supabase client instance to interact with the authentication service.
  const supabase = await createClient();

  try {
    // Construct the email verification callback URL.
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    );
    redirectUrl.searchParams.set("email_verify", email); // Add the email as a query parameter.

    // *** Workaround to maintain PKCE flow ***
    // Use `signUp` instead of `resend` to ensure consistent PKCE token formats.
    // The "user already exists" error is expected and treated as success.
    const { error } = await supabase.auth.signUp({
      email, // The user's email address.
      password: `${crypto.randomUUID()}${crypto.randomUUID()}`.slice(0, 20), // Generate a random password.
      options: {
        emailRedirectTo: redirectUrl.toString(), // Set the email verification redirect URL.
        data: {
          email_confirm_resend: true, // Flag to identify this as a resend operation.
        },
      },
    });

    // Handle errors during the `signUp` process.
    if (error) {
      // If the error indicates the user already exists, treat it as a success.
      if (error.message.includes("unique")) {
        return {
          success: true, // Indicate that the resend operation was successful.
          message: AUTH_ALERTS.VERIFICATION.RESEND_SUCCESS.message, // Predefined success message.
          email: email, // Include the email in the response.
        };
      }

      // For other errors, return a general error message.
      return {
        errors: {
          general: AUTH_ALERTS.VERIFICATION.RESEND_ERROR.message, // Predefined resend error message.
        },
      };
    }

    // If the resend operation is successful, return a success state.
    return {
      success: true, // Indicate that the resend operation was successful.
      message: AUTH_ALERTS.VERIFICATION.RESEND_SUCCESS.message, // Predefined success message.
      email: email, // Include the email in the response.
    };
  } catch (err) {
    // Handle unexpected errors during the resend process.
    console.error("Resend verification error:", err); // Log the error for debugging purposes.

    // Return a general error state.
    return {
      errors: {
        general: AUTH_ALERTS.VERIFICATION.RESEND_ERROR.message, // Predefined resend error message.
      },
    };
  }
}

/**
 * Initiates the password reset process.
 * Sends reset instructions to the user's email address.
 *
 * @param prevState - The previous state of the password reset form, used to maintain state consistency.
 * @param formData - The form data submitted by the user, containing the email field.
 * @returns A promise resolving to the updated password reset form state, including success, errors, or loading status.
 */
export async function resetPassword(
  prevState: ResetPasswordFormState, // The previous state of the password reset form.
  formData: FormData // The form data submitted by the user, containing the email field.
): Promise<ResetPasswordFormState> {
  // Extract the email from the form data.
  const email = formData.get("email") as string;

  // Validate the email input.
  if (!email || !email.includes("@")) {
    // If the email is missing or invalid, return an error state.
    return {
      errors: {
        email: AUTH_ALERTS.FORM.VALIDATION.EMAIL_REQUIRED.message, // Predefined error message for invalid email.
      },
    };
  }

  // Create a Supabase client instance to interact with the authentication service.
  const supabase = await createClient();

  try {
    // Attempt to send a password reset email.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`, // Set the redirect URL for the password reset process.
    });

    // Handle errors during the password reset process.
    if (error) {
      // Log the error in development mode for debugging purposes.
      if (process.env.NODE_ENV === "development") {
        console.error("Password reset error:", error);
      }

      // Return a general error state.
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.RESET_ERROR.message, // Predefined password reset error message.
        },
      };
    }

    // If the password reset email is sent successfully, return a success state.
    return {
      success: true, // Indicate that the password reset process was successful.
      message: AUTH_ALERTS.PASSWORD.RESET_SUCCESS.message, // Predefined success message.
    };
  } catch (error) {
    // Handle unexpected errors during the password reset process.
    if (process.env.NODE_ENV === "development") {
      console.error("Password reset error:", error); // Log the error in development mode for debugging purposes.
    }

    // Return a general error state.
    return {
      errors: {
        general: AUTH_ALERTS.PASSWORD.RESET_ERROR.message, // Predefined password reset error message.
      },
    };
  }
}

/**
 * Handles password updates
 * Validates new password and updates user credentials
 */
/**
 * Handles password updates.
 * Validates the new password and updates the user's credentials.
 *
 * @param prevState - The previous state of the password update form, used to maintain state consistency.
 * @param formData - The form data submitted by the user, containing the new password and confirmation password fields.
 * @returns A promise resolving to the updated password update form state, including success, errors, or loading status.
 */
export async function updatePassword(
  prevState: UpdatePasswordFormState, // The previous state of the password update form.
  formData: FormData // The form data submitted by the user, containing the new password and confirmation password fields.
): Promise<UpdatePasswordFormState> {
  // Extract the password and confirmPassword fields from the form data.
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate the password input.
  if (!password || password.length < 8) {
    // If the password is missing or too short, return an error state.
    return {
      errors: {
        password: AUTH_ALERTS.FORM.VALIDATION.PASSWORD_MIN_LENGTH.message, // Predefined error message for password length.
      },
    };
  }

  // Validate that the password and confirmPassword fields match.
  if (password !== confirmPassword) {
    // If the passwords do not match, return an error state.
    return {
      errors: {
        confirmPassword:
          AUTH_ALERTS.FORM.VALIDATION.PASSWORDS_DONT_MATCH.message, // Predefined error message for mismatched passwords.
      },
    };
  }

  // Create a Supabase client instance to interact with the authentication service.
  const supabase = await createClient();

  try {
    // Verify that there is an authenticated user.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Handle cases where the user is not authenticated or there is an error fetching the user.
    if (userError || !user) {
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.LINK_EXPIRED.message, // Predefined error message for expired or invalid password reset links.
        },
      };
    }

    // Update the authenticated user's password.
    const { error } = await supabase.auth.updateUser({
      password: password, // The new password to update.
    });

    // Handle errors during the password update process.
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Password update error:", error); // Log the error in development mode for debugging purposes.
      }
      return {
        errors: {
          general: AUTH_ALERTS.PASSWORD.UPDATE_ERROR.message, // Predefined error message for password update failure.
        },
      };
    }

    // Sign the user out after a successful password update.
    await supabase.auth.signOut();

    // Return a success state if the password update is successful.
    return {
      success: true, // Indicate that the password update was successful.
      message: AUTH_ALERTS.PASSWORD.UPDATE_SUCCESS.message, // Predefined success message.
    };
  } catch (error) {
    // Handle unexpected errors during the password update process.
    if (process.env.NODE_ENV === "development") {
      console.error("Password update error:", error); // Log the error in development mode for debugging purposes.
    }
    return {
      errors: {
        general: AUTH_ALERTS.PASSWORD.UPDATE_ERROR.message, // Predefined error message for unexpected errors.
      },
    };
  }
}
