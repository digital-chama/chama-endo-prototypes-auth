import * as React from 'react'

/**
 * Props for the ResendEmailButton component.
 */
interface ResendEmailButtonProps {
    email: string | null // The email address to which the verification email will be sent.
    onResendSuccess?: (email: string) => void // Callback for successful resend.
    onResendError?: () => void // Callback for failed resend.
    className?: string // Additional class names for styling the button.
}

/**
 * ResendEmailButton component.
 * A button that allows users to resend a verification email.
 *
 * @param email - The email address to resend the verification email to.
 * @param onResendSuccess - Callback function triggered when the resend is successful.
 * @param onResendError - Callback function triggered when the resend fails.
 * @param className - Additional class names for styling the button.
 * @returns A JSX element for the resend email button.
 */
export function ResendEmailButton({
    email,
    onResendSuccess,
    onResendError,
    className,
}: ResendEmailButtonProps) {
    // State to track whether the resend operation is in progress.
    const [isSending, setIsSending] = React.useState(false)

    /**
     * Handles the click event for the resend button.
     * - Triggers the `onResendSuccess` callback if the resend is successful.
     * - Triggers the `onResendError` callback if the resend fails.
     */
    const handleClick = React.useCallback(async () => {
        // If no email or no success callback is provided, exit early.
        if (!email || !onResendSuccess) return

        setIsSending(true) // Set the sending state to true to disable the button and show a loading state.
        try {
            await onResendSuccess(email) // Call the success callback with the email.
        } catch (error) {
            console.error('Error resending email:', error) // Log the error for debugging.
            onResendError?.() // Call the error callback if provided.
        } finally {
            setIsSending(false) // Reset the sending state to false after the operation completes.
        }
    }, [email, onResendSuccess, onResendError]) // Dependencies: Recreate the function only if these values change.

    return (
        <button
            className={`inline text-blue-500 hover:text-blue-700 ml-1 ${className || ''}`} // Apply default and custom styles.
            disabled={isSending} // Disable the button while the resend operation is in progress.
            onClick={handleClick} // Attach the click handler.
        >
            {isSending ? "Sending..." : "Resend email."} {/* Show "Sending..." while the operation is in progress. */}
        </button>
    )
}