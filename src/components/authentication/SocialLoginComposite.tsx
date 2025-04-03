'use client'

import React, { useState } from 'react'
import { useFormStatus } from 'react-dom' // Hook to track form submission status.
import { Icons } from '../ui/icons' // Import icons for social providers and spinner.
import { Button } from '../ui/button' // Button component for UI.
import { SocialAuthState, type SocialAuthButtonProps } from '@/types' // Type definitions for props.

/**
 * SocialAuthButton component.
 * A reusable button for handling social authentication (e.g., Google, GitHub, Microsoft).
 *
 * @param provider - The social authentication provider (e.g., 'google', 'github', 'microsoft').
 * @param loading - Indicates if the button is in a loading state.
 * @param onClick - Callback function triggered when the button is clicked.
 * @returns A JSX element for the social authentication button.
 */
function SocialAuthButton({ provider, loading, onClick }: SocialAuthButtonProps) {
    // Retrieve the pending state of the form using the useFormStatus hook.
    const { pending } = useFormStatus()

    // Determine if the button should be in a loading state.
    const isLoading = loading || pending

    // Map the provider to its corresponding icon.
    const Icon = {
        github: Icons.gitHub,
        google: Icons.google,
        microsoft: Icons.microsoft,
    }[provider]

    return (
        <Button
            variant="outline" // Use the outline variant for the button.
            type="button" // Set the button type to 'button'.
            disabled={isLoading} // Disable the button if it is in a loading state.
            onClick={onClick} // Attach the click handler.
            className={provider !== 'github' ? 'mt-4' : ''} // Add top margin for non-GitHub providers.
        >
            {/* Show a spinner icon if the button is in a loading state */}
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                // Show the provider's icon if not loading
                <Icon className="mr-2 h-4 w-4" />
            )}
            {/* Display the provider name with the first letter capitalized */}
            {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </Button>
    )
}

/**
 * Props for the SocialLoginComposite component.
 */
interface SocialLoginCompositeProps {
    onSocialAuthStateChange?: (state: SocialAuthState) => void // Callback to handle changes in social authentication state.
}

/**
 * SocialLoginComposite component.
 * A composite component for handling social login with multiple providers (e.g., Google, GitHub, Microsoft).
 *
 * @param onSocialAuthStateChange - Callback function triggered when the social authentication state changes.
 * @returns A JSX element for the social login composite.
 */
export function SocialLoginComposite({ onSocialAuthStateChange }: SocialLoginCompositeProps) {
    // State to track which provider's login is currently loading.
    const [loading, setLoading] = useState<string | null>(null)

    /**
     * Handles Microsoft login.
     * - Updates the loading state and triggers the social auth state change callback.
     * - Redirects the user to the Microsoft login URL.
     */
    const handleMicrosoftLogin = async () => {
        try {
            setLoading('microsoft') // Set the loading state to 'microsoft'.
            onSocialAuthStateChange?.({
                redirecting: true,
                provider: 'microsoft',
            }) // Notify the parent component about the redirection.

            const response = await fetch('api/auth/microsoft') // Fetch the Microsoft login URL.
            const data = await response.json()

            if (data.error) {
                throw new Error(data.error) // Throw an error if the response contains an error.
            }

            window.location.href = data.url // Redirect the user to the Microsoft login URL.
        } catch (error) {
            console.error('Microsoft Login Error', error) // Log the error for debugging.
            onSocialAuthStateChange?.({
                redirecting: false,
                provider: undefined,
            }) // Notify the parent component about the failure.
        } finally {
            setLoading(null) // Reset the loading state.
        }
    }

    /**
     * Handles Google login.
     * - Updates the loading state and triggers the social auth state change callback.
     * - Redirects the user to the Google login URL.
     */
    const handleGoogleLogin = async () => {
        try {
            setLoading('google') // Set the loading state to 'google'.
            onSocialAuthStateChange?.({
                redirecting: true,
                provider: 'google',
            }) // Notify the parent component about the redirection.

            const response = await fetch('api/auth/google') // Fetch the Google login URL.
            const data = await response.json()

            if (data.error) {
                throw new Error(data.error) // Throw an error if the response contains an error.
            }

            window.location.href = data.url // Redirect the user to the Google login URL.
        } catch (error) {
            console.error('Google Login Error', error) // Log the error for debugging.
            onSocialAuthStateChange?.({
                redirecting: false,
                provider: undefined,
            }) // Notify the parent component about the failure.
        } finally {
            setLoading(null) // Reset the loading state.
        }
    }

    return (
        <>
            {/* Divider for separating social login options */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Social login buttons */}
            <SocialAuthButton provider="github" />
            <SocialAuthButton
                provider="google"
                loading={loading === 'google'} // Show loading state for Google login.
                onClick={handleGoogleLogin} // Attach the Google login handler.
            />
            <SocialAuthButton
                provider="microsoft"
                loading={loading === 'microsoft'} // Show loading state for Microsoft login.
                onClick={handleMicrosoftLogin} // Attach the Microsoft login handler.
            />
        </>
    )
}