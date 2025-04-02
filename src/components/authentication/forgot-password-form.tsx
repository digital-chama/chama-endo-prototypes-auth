"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom"; // Hooks for managing form state and status.
import { resetPassword } from "@/app/actions/auth-service"; // Action to handle password reset requests.
import Link from "next/link"; // Link component for navigation.
import { Button } from "@/components/ui/button"; // Button component.
import { Input } from "@/components/ui/input"; // Input component for the email field.
import { Label } from "@/components/ui/label"; // Label component for form fields.
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Alert components for success or error messages.
import { Info } from "lucide-react"; // Icon for informational messages.
import { Icons } from "@/components/ui/icons"; // Spinner icon for loading state.
import { cn } from "@/lib/utils"; // Utility function for conditional class names.
import { ResetPasswordFormState } from "@/types/auth"; // Type definition for the form state.

/**
 * ResetButton component.
 * A button for submitting the password reset form.
 * Displays a spinner when the form is in a pending state.
 */
function ResetButton() {
  const { pending } = useFormStatus(); // Get the pending state of the form.

  return (
    <Button disabled={pending} className="mt-3">
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon for loading state.
      )}
      Send Reset Instructions
    </Button>
  );
}

/**
 * ForgotPasswordForm component.
 * A form for requesting password reset instructions, with validation and success/error feedback.
 *
 * @param props - Props for customizing the form's appearance and behavior.
 * @returns A JSX element for the forgot password form.
 */
export function ForgotPasswordForm({
  className, // Additional class names for styling the form.
  ...props // Other props passed to the form container.
}: React.HTMLAttributes<HTMLDivElement>) {
  // Manage the form state using the `useFormState` hook.
  const [state, formAction] = useFormState<ResetPasswordFormState, FormData>(
    resetPassword, // Action to handle password reset requests.
    {} // Initial state for the form.
  );

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Show success message if the password reset request is successful */}
      {state.success ? (
        <Alert className="bg-blue-50 border-blue-200 [&>svg]:top-3">
          <Info className="h-4 w-4 text-blue-600" /> {/* Info icon */}
          <AlertTitle className="text-blue-700 font-bold">Check Your Email</AlertTitle>
          <AlertDescription className="text-sm">
            {state.message} {/* Success message */}
            <div className="mt-2">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Back to login {/* Link to the login page */}
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        // Show the forgot password form if the reset request is not yet successful
        <form action={formAction}>
          <div className="grid gap-2">
            {/* Email Field */}
            <div className="grid gap-1">
              <Label className="text-xs text-gray-600" htmlFor="email">
                Email {/* Label for the email input field */}
              </Label>
              <Input
                id="email" // ID for the email input field.
                placeholder="name@example.com" // Placeholder text for the email input field.
                type="email" // Input type set to email for validation.
                autoCapitalize="none" // Disable auto-capitalization for email input.
                autoComplete="email" // Enable email auto-completion.
                autoCorrect="off" // Disable auto-correction for email input.
                name="email" // Name attribute for the email input field.
              />
              {/* Display error message for the email field if validation fails */}
              {state.errors?.email && (
                <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <ResetButton />

            {/* General Error Message */}
            {state.errors?.general && (
              <p className="text-sm text-red-500 mt-1">{state.errors.general}</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}