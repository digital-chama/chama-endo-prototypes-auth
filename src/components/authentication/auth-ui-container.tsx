/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AuthContent: The Authentication UI Container
 * -----------------------------------------
 * This component serves as the main authentication interface for the application.
 * It dynamically renders different authentication views (e.g., login, signup, forgot password)
 * based on the `variant` prop and manages the state for authentication flows.
 *
 * Key Responsibilities:
 * - Manages Authentication Views:
 *   • Login/Signup tabs
 *   • Password reset flows
 *   • Form state management
 *
 * - Handles UI Presentation:
 *   • Responsive layout
 *   • Branding elements
 *   • Dynamic headings and descriptions
 *
 * - Maintains User Context:
 *   • Tracks selected authentication mode
 *   • Manages alert states
 *   • Handles form transitions
 */

"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChamaLogo } from "@/assets/icons/Icons";
import { type AuthMode, type AlertState, type AuthContentProps } from "@/types";
import { ResetPasswordForm } from "./reset-password-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginSignupTabComposite } from "./LoginSignup-TabComposite";

/**
 * AuthContent component.
 * Dynamically renders authentication views (login, signup, forgot/reset password)
 * based on the `variant` prop.
 *
 * @param variant - Determines which authentication view to display.
 * @returns A JSX element for the authentication UI container.
 */
export function AuthContent({
  variant = "default", // Controls which authentication view to display.
}: AuthContentProps) {
  // State to track the current authentication mode (signin/signup).
  const [selectedTab, setSelectedTab] = React.useState<AuthMode>("signin");

  // State to manage alert states for various authentication scenarios.
  const [, setAlertState] = React.useState<AlertState>({
    error: null,                              // Current error message.
    message: null,                            // Success/info message.
    signupState: {},                          // Signup-specific state.
    loginState: {},                           // Login-specific state.
    verificationState: { expired: false },    // Email verification status.
    isPostSignup: false,                      // Tracks post-signup state.
    showVerificationAlert: false              // Controls verification alerts.
  });

  return (
    // Main container with responsive width and centered content.
    <div className="mx-auto flex w-[350px] flex-col justify-center space-y-6 px-4 sm:px-0">
      {/* Header section with logo and text */}
      <div className="flex flex-col items-center space-y-2 text-center">
        {/* Logo */}
        <Image
          src={ChamaLogo}
          alt="Chama Logo"
          className="mb-4 h-12 w-12 lg:hidden invert dark:invert-0"
        />
        {/* Dynamic heading based on the current view */}
        <h1 className="text-2xl font-semibold tracking-tight">
          {variant === "forgot-password"
            ? "Reset Password" // Heading for forgot password view.
            : variant === "reset-password"
              ? "Create New Password" // Heading for reset password view.
              : selectedTab === "signup"
                ? "Sign up" // Heading for signup view.
                : "Log in" // Default heading for login view.
          }
        </h1>
        {/* Dynamic description text */}
        <p className="text-sm text-muted-foreground">
          {variant === "forgot-password"
            ? "Enter your email to receive reset instructions" // Description for forgot password view.
            : variant === "reset-password"
              ? "Enter and confirm your new password" // Description for reset password view.
              : selectedTab === "signup"
                ? "Enter your details below to create an account" // Description for signup view.
                : "Sign in to your account" // Default description for login view.
          }
        </p>
      </div>

      {/* Conditional form rendering based on the `variant` prop */}
      {variant === "forgot-password" ? (
        <ForgotPasswordForm /> // Render forgot password form.
      ) : variant === "reset-password" ? (
        <ResetPasswordForm /> // Render reset password form.
      ) : (
        <LoginSignupTabComposite
          onTabChange={setSelectedTab} // Update the selected tab when it changes.
          onAlertStateChange={setAlertState} // Update the alert state when it changes.
        />
      )}

      {/* Terms and privacy links */}
      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking sign in or create account, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}