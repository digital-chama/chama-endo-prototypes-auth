
/**
 * LoginSignupTabComposite: The Authentication Form Manager
 * ---------------------------------------------------
 * Think of this as the main login and signup component where 
 * the auth forms and key auth components come together to 
 * create the main authentication tab component used in 
 * our login route: /login
 * 
 * - Manages Authentication Forms:
 *   • Handles login/signup tab switching
 *   • Coordinates form submissions
 *   • Manages form state and data
 * 
 * - Handles Authentication Flow:
 *   • Processes login/signup attempts
 *   • Manages success/error states
 *   • Handles redirects
 * 
 * - Coordinates UI Components:
 *   • Tab navigation
 *   • Alert displays
 *   • Social login options
 */
"use client"
import * as  React from 'react'
import { cn } from '@/lib/utils'
import { LoginForm } from './login-form'
import { AUTH_ALERTS } from '@/lib/auth/alerts/auth-alerts'
import { type AuthFormState, type AuthFormData, type AlertState, type AuthMode, type SocialAuthState } from '@/types'
import { useSearchParams } from 'next/navigation'
import { signup, login } from '@/app/actions/auth-service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModeSwitcher } from './auth-mode-switcher'
import { signupForm } from './signup-form'
import { AlertContainer } from './alert-container'
import { SocialLoginComposite } from './SocialLoginComposite'

interface LoginSignupTabCompositeProps extends React.HTMLAttributes<HTMLDivElement> {
    onTabChange?: (tab: AuthMode) => void        // Parent tab change callback
    onAlertStateChange: React.Dispatch<React.SetStateAction<AlertState>>  // Alert state updater
}

export function LoginSignupTabComposite({ className, onTabChange, onAlertStateChange, ...props }: LoginSignupTabCompositeProps) {
    //state management for the forms and ui
    const [currentTab, setCurrentTab] = React.useState('signin')
    const searchParams = useSearchParams()
    const formRef = React.useRef<HTMLFormElement>(null)
    const loginFormRef = React.useRef<HTMLFormElement> (null)
   //form data and validation state
   const [formData, setFormData ] = React.useState<AuthFormData>({
    loginEmail: '',
    loginPassword: '',
    signupEmail: '',
    signupPassword: '',
    signupName: ''

   })

   const [passwordError, setPasswordError] = React.useState<string>() 
     // Alert and authentication state
}