"use client"
import* as  React from 'react'
import { cn } from '@/lib/utils'
import { LoginForm } from './login-form'
import { AUTH_ALERTS } from '@/lib/auth/alerts/auth-alerts'
import { type AuthFormState, type AuthFormData, type AlertState, type AuthMode, type SocialAuthState } from '@/types'
import { useSearchParams } from 'next/navigation'
import { signup, login } from '@/app/actions/auth-service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModeSwitcher } from './auth-mode-switcher'
const LoginSignupTabComposite = () => {
    return (
        <div>

        </div>
    )
}

export default LoginSignupTabComposite
