"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components for the dialog UI.
import { AlertTriangle, MailCheck } from "lucide-react"; // Import icons for error and success states.

interface ResendVerificationEmailAlertDialogProps {
  open: boolean; // Whether the dialog is open or not.
  onOpenChange: (open: boolean) => void; // Callback to handle dialog open/close state.
  email?: string | null; // The email address to which the verification email was sent.
  error?: string | null; // Error message, if any, for the resend operation.
}

/**
 * ResendVerificationEmailAlertDialog component.
 * Displays a dialog to inform the user about the status of the resend verification email operation.
 *
 * @param open - Whether the dialog is open or not.
 * @param onOpenChange - Callback to handle dialog open/close state.
 * @param email - The email address to which the verification email was sent.
 * @param error - Error message, if any, for the resend operation.
 * @returns A JSX element for the alert dialog.
 */
export function ResendVerificationEmailAlertDialog({
  open,
  onOpenChange,
  email,
  error,
}: ResendVerificationEmailAlertDialogProps) {
  // Callback to close the dialog.
  const handleClose = React.useCallback(() => {
    onOpenChange(false); // Set the dialog's open state to false.
  }, [onOpenChange]);

  // Determine if the dialog is in an error state.
  const isError = error || !email;

  return (
    <AlertDialog
      open={open} // Control the dialog's open state.
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen); // Update the open state when the dialog is toggled.
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {/* Display an error or success icon based on the state */}
            {isError ? (
              <AlertTriangle className="h-5 w-5 text-destructive" /> // Error icon with destructive color.
            ) : (
              <MailCheck className="h-5 w-5 text-green-600" /> // Success icon with green color.
            )}
            <AlertDialogTitle>
              {isError ? "Failed to Send Email" : "Email Sent"} {/* Title based on the state */}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {/* Description message based on the state */}
            {error
              ? "We couldn't resend the verification email. Please try again later." // Error message.
              : email
              ? `We've sent you another verification email to ${email}. Please check your inbox.` // Success message with the email address.
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              : "We couldn't process your request. Please try again."} // Fallback message if no email or error is provided.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              handleClose(); // Close the dialog when the action button is clicked.
            }}
          >
            OK {/* Action button text */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}