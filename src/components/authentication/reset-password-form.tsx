"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom"; // Hooks for managing form state and status.
import { updatePassword } from "@/app/actions/auth-service"; // Action to handle password updates.
import Link from "next/link"; // Link component for navigation.
import { Button } from "@/components/ui/button"; // Button component.
import { PasswordInput } from "./password-input"; // Password input component with validation and toggle visibility.
import { Label } from "@/components/ui/label"; // Label component for form fields.
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Alert components for success or error messages.
import { Info } from "lucide-react"; // Icon for informational messages.
import { Icons } from "@/components/ui/icons"; // Spinner icon for loading state.
import { cn } from "@/lib/utils"; // Utility function for conditional class names.
import { UpdatePasswordFormState } from "@/types/auth"; // Type definition for the form state.

/**
 * Button component for submitting the password update form.
 * Displays a spinner when the form is in a pending state.
 */
function UpdatePasswordButton() {
  const { pending } = useFormStatus(); // Get the pending state of the form.

  return (
    <Button disabled={pending} className="mt-3">
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> // Spinner icon for loading state.
      )}
      Update Password
    </Button>
  );
}

/**
 * ResetPasswordForm component.
 * A form for updating the user's password, with validation and success/error feedback.
 *
 * @param props - Props for customizing the form's appearance and behavior.
 * @returns A JSX element for the reset password form.
 */
export function ResetPasswordForm({
  className, // Additional class names for styling the form.
  ...props // Other props passed to the form container.
}: React.HTMLAttributes<HTMLDivElement>) {
  // Manage the form state using the `useFormState` hook.
  const [state, formAction] = useFormState<UpdatePasswordFormState, FormData>(
    updatePassword, // Action to handle password updates.
    {} // Initial state for the form.
  );

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Show success message if the password update is successful */}
      {state.success ? (
        <Alert className="bg-blue-50 border-blue-200 [&>svg]:top-3">
          <Info className="h-4 w-4 text-blue-600" /> {/* Info icon */}
          <AlertTitle className="text-blue-700 font-bold">
            Password Updated
          </AlertTitle>
          <AlertDescription className="text-sm">
            {state.message} {/* Success message */}
            <div className="mt-2">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Back to login {/* Link to the login page */}
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        // Show the password reset form if the update is not yet successful
        <form action={formAction}>
          <div className="grid gap-2">
            {/* New Password Field */}
            <div className="grid gap-1">
              <Label className="text-xs text-gray-600" htmlFor="password">
                New Password
              </Label>
              <PasswordInput
                id="password"
                placeholder="Enter your new password"
                name="password"
                autoComplete="new-password"
                showRequirements={true} // Show password requirements dynamically.
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.password} {/* Error message for the password field */}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="grid gap-1">
              <Label className="text-xs text-gray-600" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your new password"
                name="confirmPassword"
                autoComplete="new-password"
              />
              {state.errors?.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {state.errors.confirmPassword} {/* Error message for the confirm password field */}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <UpdatePasswordButton />

            {/* General Error Message */}
            {state.errors?.general && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.general} {/* General error message */}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}