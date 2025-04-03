"use client";

import * as React from "react";
import { useFormStatus } from "react-dom"; // Hook for managing form submission status.
import { Icons } from "@/components/ui/icons"; // Icons for UI elements.
import { Button } from "@/components/ui/button"; // Button component.
import { Input } from "@/components/ui/input"; // Input component for text fields.
import { Label } from "@/components/ui/label"; // Label component for form fields.
import { PasswordInput } from "./password-input"; // Password input component with validation and toggle visibility.
import { type SignupFormProps, type AuthFormData } from "@/types"; // Type definitions for props and form data.

/**
 * SignUpButton component.
 * Renders a button for signing up, with a spinner to indicate the loading state.
 *
 * @returns A JSX element for the sign-up button.
 */
function SignUpButton() {
  const { pending } = useFormStatus(); // Retrieve the pending state of the form.

  return (
    <Button disabled={pending} className="mt-3">
      {/* Show a spinner icon when the form is in a pending state */}
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Sign Up {/* Button text */}
    </Button>
  );
}

/**
 * signupForm component.
 * A form for user registration, with validation and error handling.
 *
 * @param props - Props for customizing the form's behavior and appearance.
 * @returns A JSX element for the sign-up form.
 */
export function signupForm({
  signupState, // State of the sign-up process (e.g., loading, errors).
  signupAction, // Action to handle form submission.
  formRef, // Reference to the form element.
  formData, // Current form data (e.g., name, email, password).
  setFormData, // Function to update the form data.
  passwordError, // Error message for the password field.
  setPasswordError, // Function to update the password error state.
}: SignupFormProps) {
  return (
    <form ref={formRef} action={signupAction}>
      <div className="grid gap-2">
        {/* Name Field */}
        <div className="grid">
          <Label htmlFor="fullName" className="text-xs text-gray-600 mb-1">
            Name {/* Label for the name input field */}
          </Label>
          <Input
            id="fullName" // ID for the name input field.
            name="fullName" // Name attribute for the input field.
            placeholder="Enter your full name" // Placeholder text.
            type="text" // Input type set to text.
            autoCapitalize="words" // Capitalize the first letter of each word.
            autoComplete="name" // Enable name auto-completion.
            autoCorrect="off" // Disable auto-correction.
            disabled={signupState.loading} // Disable the input if the form is loading.
            value={formData.signupName} // Bind the input value to the form data.
            onChange={(e) =>
              setFormData((prev: AuthFormData) => ({
                ...prev,
                signupName: e.target.value, // Update the name field in the form data.
              }))
            }
          />
          {/* Display error message for the name field if validation fails */}
          {signupState.errors?.fullName && (
            <p className="text-sm text-red-500 mt-1">
              {signupState.errors.fullName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="grid mt-3">
          <Label htmlFor="email" className="text-xs text-gray-600 mb-1">
            Email {/* Label for the email input field */}
          </Label>
          <Input
            id="email" // ID for the email input field.
            name="email" // Name attribute for the input field.
            placeholder="Enter your email" // Placeholder text.
            type="email" // Input type set to email for validation.
            autoCapitalize="none" // Disable auto-capitalization.
            autoComplete="email" // Enable email auto-completion.
            autoCorrect="off" // Disable auto-correction.
            disabled={signupState.loading} // Disable the input if the form is loading.
            value={formData.signupEmail} // Bind the input value to the form data.
            onChange={(e) =>
              setFormData((prev: AuthFormData) => ({
                ...prev,
                signupEmail: e.target.value, // Update the email field in the form data.
              }))
            }
          />
          {/* Display error message for the email field if validation fails */}
          {signupState.errors?.email && (
            <p className="text-sm text-red-500 mt-1">
              {signupState.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="grid mt-3">
          <Label htmlFor="signupPassword" className="text-xs text-gray-600 mb-1">
            Password {/* Label for the password input field */}
          </Label>
          <PasswordInput
            id="signupPassword" // ID for the password input field.
            name="password" // Name attribute for the input field.
            placeholder="Enter your password" // Placeholder text.
            autoCapitalize="none" // Disable auto-capitalization.
            autoComplete="new-password" // Enable password auto-completion.
            value={formData.signupPassword} // Bind the input value to the form data.
            onChange={(e) => {
              setFormData((prev: AuthFormData) => ({
                ...prev,
                signupPassword: (e as React.ChangeEvent<HTMLInputElement>).target
                  .value, // Update the password field in the form data.
              }));
              setPasswordError(undefined); // Clear the password error state.
            }}
            showRequirements={true} // Show password requirements dynamically.
            showSuccessMessage={true} // Show a success message when the password is valid.
            persistentRequirements={true} // Always show password requirements.
          />
          {/* Display error message for the password field if validation fails */}
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
        </div>

        {/* Submit Button */}
        <SignUpButton />

        {/* General Error Message */}
        {signupState.errors?.general && (
          <p className="text-sm text-red-500 mt-1">
            {signupState.errors.general}
          </p>
        )}
      </div>
    </form>
  );
}