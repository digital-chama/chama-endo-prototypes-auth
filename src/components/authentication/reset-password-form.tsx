"use client"

import * as React from "react"
import { useFormState, useFormStatus } from 'react-dom'
import { updatePassword } from '@/app/actions/auth-service'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "./password-input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { UpdatePasswordFormState } from "@/types/auth"

function UpdatePasswordButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button disabled={pending} className="mt-3">
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Update Password
    </Button>
  )
}

export function ResetPasswordForm({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  const [state, formAction] = useFormState<UpdatePasswordFormState, FormData>(updatePassword, {})

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {state.success ? (
        <Alert className="bg-blue-50 border-blue-200 [&>svg]:top-3">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700 font-bold">Password Updated</AlertTitle>
          <AlertDescription className="text-sm">
            {state.message}
            <div className="mt-2">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form action={formAction}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="text-xs text-gray-600" htmlFor="password">
                New Password
              </Label>
              <PasswordInput
                id="password"
                placeholder="Enter your new password"
                name="password"
                autoComplete="new-password"
                showRequirements={true}
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
              )}
            </div>
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
                <p className="text-sm text-red-500 mt-1">{state.errors.confirmPassword}</p>
              )}
            </div>
            <UpdatePasswordButton />
            {state.errors?.general && (
              <p className="text-sm text-red-500 mt-1">{state.errors.general}</p>
            )}
          </div>
        </form>
      )}
    </div>
  )
} 