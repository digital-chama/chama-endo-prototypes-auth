/**
 * AuthAlerts: The Alert Message Orchestrator
 * ----------------------------------------
 * Think of this as the alert decision maker that:
 * 
 * - Manages Alert Creation:
 *   • Interprets auth events (errors, messages)
 *   • Creates appropriate alert types
 *   • Handles verification states
 * 
 * - Handles Email Verification:
 *   • Manages resend verification flow
 *   • Tracks verification states
 *   • Shows verification dialogs
 * 
 * - Maintains Alert History:
 *   • Prevents duplicate alerts
 *   • Tracks previous states
 *   • Updates only on changes
 */

import * as React from "react";
import { useAlerts } from "@/contexts/GlobalAlertManager"; // Custom hook for managing global alerts.
import { type AuthAlertsProps } from "@/types"; // Type definitions for props.
import { createAuthAlert, AUTH_ALERTS } from "@/lib/auth/alerts/auth-alerts"; // Utility for creating alerts.
import { resendVerification } from "@/app/actions/auth-service"; // Action to handle resend verification.
import { type AuthFormState } from "@/types"; // Type definition for authentication form state.
import { ResendVerificationEmailAlertDialog } from "./resend-verification-email-alert-dialog"; // Component for showing resend verification dialog.

export function AuthAlerts({
    error, // Current error state.
    message, // Success/info message.
    verificationState, // Email verification status.
    email, // User's email for verification.
    socialAuthState, // Social authentication state (new prop).
}: AuthAlertsProps) {
    // Access global alert management.
    const { addAlert } = useAlerts();

    /**
     * React Hook: useRef
     * ------------------
     * - Tracks the previous `error` and `message` states to avoid duplicate alerts.
     * - `useRef` provides a mutable object that persists across renders.
     */
    const prevError = React.useRef(error); // Store the previous error state.
    const prevMessage = React.useRef(message); // Store the previous message state.

    /**
     * React Hook: useState
     * --------------------
     * - Manages local state for the resend verification dialog and its related data.
     * - `useState` provides a stateful value and a function to update it.
     */
    const [showResendDialog, setShowResendDialog] = React.useState(false); // State to control the visibility of the resend dialog.
    const [resendError, setResendError] = React.useState<string | null>(null); // State to store resend error messages.
    const [resendEmail, setResendEmail] = React.useState<string | null>(null); // State to store the email used for resending verification.

    /**
     * React Hook: useCallback
     * -----------------------
     * - Memoizes the `handleResendSuccess` function to prevent unnecessary re-creations on re-renders.
     * - Ensures the function reference remains stable unless its dependencies change.
     */
    const handleResendSuccess = React.useCallback(async (email: string) => {
        try {
            const formData = new FormData(); // Create a new FormData object to send the email.
            formData.append("email", email); // Append the email to the form data.

            // Call the resend verification action with the form data.
            const result = await resendVerification({} as AuthFormState, formData);

            if (result.success) {
                // If the resend is successful, update the state with the email and clear errors.
                setResendEmail(email);
                setResendError(null);
            } else {
                // If the resend fails, set the error message.
                setResendError(result.errors?.general || "Failed to resend verification email");
            }

            // Show the resend verification dialog.
            setShowResendDialog(true);
        } catch (error: unknown) {
            // Handle unexpected errors during the resend process.
            console.error("Error resending verification email:", error);
            setResendError("Failed to resend verification email");
            setShowResendDialog(true);
        }
    }, []); // No dependencies, so the function is memoized once.

    /**
     * React Hook: useCallback
     * -----------------------
     * - Memoizes the `handleResendError` function to prevent unnecessary re-creations on re-renders.
     * - Ensures the function reference remains stable unless its dependencies change.
     */
    const handleResendError = React.useCallback(() => {
        // Set a generic error message and show the resend dialog.
        setResendError("Failed to resend verification email");
        setShowResendDialog(true);
    }, []); // No dependencies, so the function is memoized once.


    // Monitor and handle error state changes
    React.useEffect(() => {
        // Check if there is a new error and it is different from the previous error
        if (error && error !== prevError.current) {
            // Handle various error scenarios with appropriate alerts

            // Case 1: Email not confirmed
            if (error === 'email_not_confirmed') {
                addAlert(
                    createAuthAlert('LOGIN', 'VERIFICATION_REQUIRED', {
                        resendVerificationEmail: email
                            ? {
                                enabled: true, // Enable the resend verification email option.
                                email, // Pass the user's email.
                                onResendSuccess: handleResendSuccess, // Callback for successful resend.
                                onResendError: handleResendError, // Callback for resend failure.
                            }
                            : undefined, // If no email is provided, disable the resend option.
                    })
                );
            }

            // Case 2: Account already exists
            else if (error === AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS.message) {
                addAlert(createAuthAlert('SIGNUP', 'ACCOUNT_EXISTS')); // Show an alert for an existing account.
            }

            // Case 3: Account exists but is unverified
            else if (error === AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED.message) {
                addAlert(
                    createAuthAlert('SIGNUP', 'ACCOUNT_EXISTS_UNVERIFIED', {
                        resendVerificationEmail: email
                            ? {
                                enabled: true, // Enable the resend verification email option.
                                email, // Pass the user's email.
                                onResendSuccess: handleResendSuccess, // Callback for successful resend.
                                onResendError: handleResendError, // Callback for resend failure.
                            }
                            : undefined, // If no email is provided, disable the resend option.
                    })
                );
            }

            // Case 4: Verification link expired
            else if (error === 'verification_expired') {
                addAlert(
                    createAuthAlert('VERIFICATION', 'EXPIRED', {
                        resendVerificationEmail: email
                            ? {
                                enabled: true, // Enable the resend verification email option.
                                email, // Pass the user's email.
                                onResendSuccess: handleResendSuccess, // Callback for successful resend.
                                onResendError: handleResendError, // Callback for resend failure.
                            }
                            : undefined, // If no email is provided, disable the resend option.
                    })
                );
            }

            // Case 5: General login error (not related to verification)
            else if (!error.includes('verify')) {
                addAlert(
                    createAuthAlert('LOGIN', 'ERROR', {
                        message: error, // Pass the error message to the alert.
                    })
                );
            }
        }

        // Update the previous error reference to the current error
        prevError.current = error;
    }, [error, addAlert, email, handleResendSuccess, handleResendError, verificationState]);

    /**
     * React Hook: useEffect
     * ---------------------
     * - Monitors the `message` state and triggers appropriate actions when it changes.
     * - Ensures that alerts are created for various success/info scenarios.
     *
     * Dependencies:
     * - `message`: The current message state.
     * - `addAlert`: Function to add a new alert to the global alert manager.
     * - `email`: The user's email address (used for resend verification).
     * - `handleResendSuccess`: Callback for successful resend verification.
     * - `handleResendError`: Callback for failed resend verification.
     */
    React.useEffect(() => {
        // Check if there is a new message and it is different from the previous message
        if (message && message !== prevMessage.current) {
            // Handle various success/info scenarios with appropriate alerts

            // Case 1: Verification was successful
            if (message === 'verification_success') {
                addAlert(createAuthAlert('VERIFICATION', 'SUCCESS')); // Show a success alert for verification.
            }

            // Case 2: Email is already verified
            else if (message === 'already_verified') {
                addAlert(createAuthAlert('VERIFICATION', 'ALREADY_VERIFIED')); // Show an alert indicating the email is already verified.
            }

            // Case 3: Verified in a different browser
            else if (message === 'verified_different_browser') {
                addAlert(createAuthAlert('VERIFICATION', 'VERIFIED_DIFFERENT_BROWSER')); // Show an alert indicating verification occurred in a different browser.
            }

            // Case 4: Signup was successful
            else if (message === AUTH_ALERTS.SIGNUP.SUCCESS.message) {
                addAlert(
                    createAuthAlert('SIGNUP', 'SUCCESS', {
                        resendVerificationEmail: email
                            ? {
                                enabled: true, // Enable the resend verification email option.
                                email, // Pass the user's email.
                                onResendSuccess: handleResendSuccess, // Callback for successful resend.
                                onResendError: handleResendError, // Callback for resend failure.
                            }
                            : undefined, // If no email is provided, disable the resend option.
                    })
                );
            }

            // Case 5: General success message
            else {
                addAlert(
                    createAuthAlert('LOGIN', 'SUCCESS', {
                        message, // Pass the success message to the alert.
                    })
                );
            }
        }

        // Update the previous message reference to the current message
        prevMessage.current = message;
    }, [message, addAlert, email, handleResendSuccess, handleResendError]);

    /**
     * React Hook: useEffect
     * ---------------------
     * - Monitors the `socialAuthState` to handle redirection alerts for social authentication providers.
     * - Triggers appropriate alerts when a redirection for social login occurs.
     *
     * Dependencies:
     * - `socialAuthState`: The current state of social authentication (e.g., redirecting, provider).
     * - `addAlert`: Function to add a new alert to the global alert manager.
     */
    React.useEffect(() => {
        // Check if the social authentication state indicates a redirection and a provider is specified
        if (socialAuthState?.redirecting && socialAuthState.provider) {
            // Define a mapping of social authentication providers to their corresponding alert types
            const redirectAlerts = {
                microsoft: 'REDIRECT_MICROSOFT', // Alert type for Microsoft redirection
                google: 'REDIRECT_GOOGLE', // Alert type for Google redirection
                github: 'REDIRECT_GITHUB', // Alert type for GitHub redirection
            } as const;

            // Get the alert type based on the provider in the socialAuthState
            const alertType = redirectAlerts[socialAuthState.provider];

            // If a valid alert type is found, create and add the alert
            if (alertType) {
                addAlert(createAuthAlert('LOGIN', alertType)); // Add the alert for the specific provider
            }
        }
    }, [socialAuthState, addAlert]); // Dependencies: Re-run the effect when `socialAuthState` or `addAlert` changes

    return (
        <>
            <ResendVerificationEmailAlertDialog
                open={showResendDialog}
                onOpenChange={setShowResendDialog}
                email={resendEmail}
                error={resendError}
            />
        </>
    )
}
