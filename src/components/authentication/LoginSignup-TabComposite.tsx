/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * LoginSignupTabComposite: The Authentication Form Manager
 * ---------------------------------------------------
 * This component serves as the main authentication manager for login and signup functionality.
 * It combines login, signup, and social authentication into a tabbed interface.
 *
 * Key Responsibilities:
 * - Manages Authentication Forms:
 *   • Handles login/signup tab switching.
 *   • Coordinates form submissions for login and signup.
 *   • Manages form state and validation.
 *
 * - Handles Authentication Flow:
 *   • Processes login/signup attempts.
 *   • Manages success/error states.
 *   • Handles redirects after successful authentication.
 *
 * - Coordinates UI Components:
 *   • Tab navigation for login/signup.
 *   • Alert displays for success/error messages.
 *   • Social login options (e.g., Google, GitHub, Microsoft).
 */

"use client"
import * as React from 'react'
import { cn } from '@/lib/utils'
import { LoginForm } from './login-form'
import { AUTH_ALERTS } from '@/lib/auth/alerts/auth-alerts'
import { type AuthFormState, type AuthFormData, type AlertState, type AuthMode, type SocialAuthState } from '@/types'
import { useSearchParams } from 'next/navigation'
import { signup, login } from '@/app/actions/auth-service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModeSwitcher } from './auth-mode-switcher'
import { SignupForm } from './signup-form'
import { AlertContainer } from './alert-container'
import { SocialLoginComposite } from './SocialLoginComposite'
import { AuthAlerts } from './auth-alerts-orchestrator'

/**
 * Props for the LoginSignupTabComposite component.
 */
interface LoginSignupTabCompositeProps extends React.HTMLAttributes<HTMLDivElement> {
    onTabChange?: (tab: AuthMode) => void        // Callback for notifying parent about tab changes.
    onAlertStateChange: React.Dispatch<React.SetStateAction<AlertState>>  // Callback for updating alert state.
}

/**
 * LoginSignupTabComposite component.
 * Combines login, signup, and social authentication into a tabbed interface.
 *
 * @param className - Additional class names for styling the component.
 * @param onTabChange - Callback for notifying parent about tab changes.
 * @param onAlertStateChange - Callback for updating alert state.
 * @returns A JSX element for the authentication manager.
 */
export function LoginSignupTabComposite({ className, onTabChange, onAlertStateChange, ...props }: LoginSignupTabCompositeProps) {
    // State to track the current active tab (login or signup).
    const [currentTab, setCurrentTab] = React.useState<AuthMode>('signin')

    // Hook to access URL search parameters (e.g., for error handling or redirection).
    const searchParams = useSearchParams()

    // Refs for managing form elements.
    const formRef = React.useRef<HTMLFormElement>(null!)
    const loginFormRef = React.useRef<HTMLFormElement>(null!) as React.RefObject<HTMLFormElement>

    // State to manage form data for login and signup.
    const [formData, setFormData] = React.useState<AuthFormData>({
        loginEmail: '',
        loginPassword: '',
        signupEmail: '',
        signupPassword: '',
        signupName: ''
    })

    // State to track password validation errors.
    const [passwordError, setPasswordError] = React.useState<string>()

    // State to manage alerts and authentication states.
    const [localAlertState, setLocalAlertState] = React.useState<AlertState>({
        error: null,
        message: null,
        signupState: {},
        loginState: {},
        verificationState: { expired: false },
        isPostSignup: false,
        showVerificationAlert: false
    })

    // URL parameters for error handling and email verification.
    const error = searchParams.get('error')
    const urlEmail = searchParams.get('email')

    // Sync local alert state with the parent component.
    React.useEffect(() => {
        onAlertStateChange(localAlertState)
    }, [localAlertState, onAlertStateChange])

    /**
     * Handles tab switching and resets alerts.
     * @param value - The new tab value (e.g., 'signin' or 'signup').
     */
    const handleTabChange = React.useCallback((value: string) => {
        setCurrentTab(value as AuthMode)
        onTabChange?.(value as AuthMode)
        setLocalAlertState(prev => ({
            ...prev,
            error: null,
            message: null,
            showVerificationAlert: false
        }))
    }, [onTabChange])

    /**
     * Processes login attempts.
     * @param formData - The form data submitted for login.
     */
    const handleLogin = React.useCallback(async (formData: FormData): Promise<void> => {
        try {
            const result = await login({} as AuthFormState, formData)

            if (result.success) {
                // Handle successful login.
                setLocalAlertState(prev => ({
                    ...prev,
                    error: null,
                    message: AUTH_ALERTS.LOGIN.SUCCESS.message,
                    loginState: result
                }))
                // Redirect the user after a brief timeout.
                setTimeout(() => {
                    const redirectTo = searchParams.get('redirect_to') || '/'
                    window.location.href = redirectTo
                }, 0)
            } else if (result.errors) {
                // Handle login errors.
                setLocalAlertState(prev => ({
                    ...prev,
                    error: result.errors?.general || null,
                    message: null,
                    loginState: result,
                    showVerificationAlert: result.verificationPending || false,
                    email: result.email
                }))
            }
        } catch {
            // Handle unexpected errors during login.
            setLocalAlertState(prev => ({
                ...prev,
                error: 'An error occurred during login',
                message: null,
                loginState: {}
            }))
        }
    }, [searchParams])

    /**
     * Processes signup attempts.
     * @param formData - The form data submitted for signup.
     */
    const handleSignup = React.useCallback(async (formData: FormData): Promise<void> => {
        try {
            const result = await signup({} as AuthFormState, formData)
            if (result.success) {
                // Handle successful signup.
                setLocalAlertState(prev => ({
                    ...prev,
                    error: null,
                    message: result.message || 'Signup successful',
                    signupState: result,
                    isPostSignup: true,
                    showVerificationAlert: true,
                    email: result.email
                }))
            } else if (result.errors) {
                // Handle signup errors.
                setLocalAlertState(prev => ({
                    ...prev,
                    error: result.errors?.general || result.errors?.email || null,
                    message: null,
                    signupState: result,
                    email: result.email
                }))
            }
        } catch {
            // Handle unexpected errors during signup.
            setLocalAlertState(prev => ({
                ...prev,
                error: 'An error occurred during signup',
                message: null,
                signupState: {}
            }))
        }
    }, [])

    // Handle URL message parameters.
    const message = searchParams.get('message')
    React.useEffect(() => {
        if (message) {
            setLocalAlertState(prev => ({
                ...prev,
                message,
                error: null,
            }))
        }
    }, [message])

    // Handle URL error parameters.
    React.useEffect(() => {
        if (error) {
            setLocalAlertState(prev => ({
                ...prev,
                error,
                message: null,
                email: urlEmail
            }))
        }
    }, [error, urlEmail])

    /**
     * Resets the alert state.
     */
    const handleAlertClose = React.useCallback(() => {
        setLocalAlertState(prev => ({
            ...prev,
            error: null,
            message: null,
            showVerificationAlert: false
        }))
    }, [])

    // State to track social authentication state.
    const [socialAuthState, setSocialAuthState] = React.useState<SocialAuthState>({
        redirecting: false,
        provider: undefined
    })

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Tabs
                value={currentTab}
                className="w-full"
                onValueChange={handleTabChange}
            >
                {/* Alert displays */}
                <div className="mt-4">
                    <AlertContainer
                        className="mb-4"
                        onAlertClose={handleAlertClose}
                    />
                    <AuthAlerts
                        error={localAlertState.error}
                        message={localAlertState.message}
                        verificationState={localAlertState.verificationState}
                        showVerificationAlert={localAlertState.showVerificationAlert}
                        email={localAlertState.email}
                        socialAuthState={socialAuthState}
                    />
                </div>

                {/* Tab navigation */}
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Authentication forms */}
                <TabsContent value="signin">
                    <LoginForm
                        loginState={{}}
                        loginAction={handleLogin}
                        formRef={loginFormRef}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm
                        signupState={{}}
                        signupAction={handleSignup}
                        formRef={formRef}
                        formData={formData}
                        setFormData={setFormData}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                    />
                </TabsContent>
            </Tabs>

            {/* Additional authentication options */}
            <SocialLoginComposite
                onSocialAuthStateChange={setSocialAuthState}
            />
            <AuthModeSwitcher
                currentTab={currentTab}
                setCurrentTab={handleTabChange}
            />
        </div>
    )
}