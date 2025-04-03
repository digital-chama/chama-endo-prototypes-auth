import { PasswordInput } from "./password-input";
import { useFormStatus } from "react-dom";

import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Link from "next/link";
import { type LoginFormProps, type AuthFormData } from "@/types";
import React from "react";
/**
 * SignInButton component.
 * Renders a button for signing in, with a spinner to indicate the loading state.
 *
 * @returns A memoized JSX element for the sign-in button.
 */
function SignInButton() {
  // Retrieve the pending state of the form using the useFormStatus hook.
  const { pending } = useFormStatus();

  // Memoize the button rendering logic to avoid unnecessary re-renders.
  return React.useMemo(() => (
    <Button disabled={pending} className="mt-3">
      {/* Show a spinner icon when the form is in a pending state */}
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Sign In {/* Button text */}
    </Button>
  ), [pending]); // Re-render the button only when the pending state changes.
}

export function LoginForm({
  loginState,
  loginAction,
  formRef,
  formData,
  setFormData,
  loginErrors

}: LoginFormProps) {
  return (
    <form ref={formRef} action={loginAction} >
      <div className="grid gap-2 ">
        <div className="grid">
          <Label htmlFor="loginEmail" className="text-xs text-gray-600 mb-1">
            Email
          </Label>
          <Input
            id="loginEmail"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={loginState.loading}
            value={formData.loginEmail}
            onChange={e => setFormData((prev: AuthFormData) => ({
              ...prev,
              loginEmail: e.target.value
            }))}
          />
          {loginErrors?.email && (
            <p className="text-sm text-red-500 mt-1">{loginErrors.email}</p>
          )}

        </div>
        <div className="grid mt-3">
          <Label htmlFor="loginPassword" className="text-xs text-gray-600 mb-1">
            Password
          </Label>
          <PasswordInput
            id="loginPassword"
            name="password"
            placeholder="Enter your password"
            autoCapitalize="none"
            autoComplete="current-password"
            value={formData.loginPassword}
            onChange={e => setFormData((prev: AuthFormData) => ({
              ...prev,
              loginPassword: (e as React.ChangeEvent<HTMLInputElement>).target.value
            }))}
            showRequirements={false}
            showSuccessMessage={false}
          />
          {loginErrors?.password && (
            <p className="text-sm text-red-500 mt-1">{loginErrors.password}</p>
          )}
          <Link
            href="/auth/forgot-password"
            className="text-xs text-left text-gray-600 hover:underline mt-1"
          >
            Forgot Password?
          </Link>
        </div>
        <SignInButton />

      </div>

    </form>
  )

}