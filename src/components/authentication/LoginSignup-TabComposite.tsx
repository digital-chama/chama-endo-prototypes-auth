/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { SignupForm } from './signup-form'
import { AlertContainer } from './alert-container'
import { SocialLoginComposite } from './SocialLoginComposite'
import { AuthAlerts } from './auth-alerts-orchestrator'

interface LoginSignupTabCompositeProps extends React.HTMLAttributes<HTMLDivElement> {
    onTabChange?: (tab: AuthMode) => void        // Parent tab change callback
    onAlertStateChange: React.Dispatch<React.SetStateAction<AlertState>>  // Alert state updater
}

export function LoginSignupTabComposite({ className, onTabChange, onAlertStateChange, ...props }: LoginSignupTabCompositeProps) {
    //state management for the forms and ui
    const [currentTab, setCurrentTab] = React.useState('signin')
    const searchParams = useSearchParams()
    const formRef = React.useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>
    const loginFormRef = React.useRef<HTMLFormElement>(null) as React.RefObject<HTMLFormElement>
    //form data and validation state
    const [formData, setFormData] = React.useState<AuthFormData>({
        loginEmail: '',
        loginPassword: '',
        signupEmail: '',
        signupPassword: '',
        signupName: ''

    })

    const [passwordError, setPasswordError] = React.useState<string>()
    // Alert and authentication statete, 
    const [localAlertState, setLocalAlertState] = React.useState<AlertState>({
        error: null,
        message: null,
        signupState: {},
        loginState: {},
        verificationState: { expired: false },
        isPostSignup: false,
        showVerificationAlert: false
    })
    //url parameters for error handling and email verification
    const error = searchParams.get('error')
    const urlEmail = searchParams.get('email')

    //sync local alert state with the parent component
    React.useEffect(() => {
        onAlertStateChange(localAlertState)
    }, [localAlertState, onAlertStateChange])

    //handle tab switching and reset alerts
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

    //process login attempts 
    const handleLogin = React.useCallback(async (formData: FormData): Promise<void> => {
        try {
            const result = await login({} as AuthFormState, formData)


            if (result.success) {
                //handle success login
                setLocalAlertState(prev => ({
                    ...prev,
                    error: null,
                    message: AUTH_ALERTS.LOGIN.SUCCESS.message,
                    loginState: result
                }))
                //brief timeout to allow alert to show and redirect
                //redirect users as soon as possible(0ms)
                //Best practice for timeout only for debugging
                setTimeout(() => {
                    const redirectTo = searchParams.get('redirect_to') || '/'
                    window.location.href = redirectTo
                }, 0) //zero for speed. increase timeout if needed for debugging
            } else if (result.errors) {
                //handle login errors
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
            //handle unexpected errors
            setLocalAlertState(prev =>
            (
                {
                    ...prev,
                    error: 'An error occured during login ',
                    message: null,
                    loginState: {}
                }
            )
            )

        }
    }, [searchParams])
    // Process signup attempts
    const handleSignup = React.useCallback(async (formData: FormData): Promise<void> => {
        try {
            const result = await signup({} as AuthFormState, formData)
            if (result.success) {
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
                setLocalAlertState(prev => ({
                    ...prev,
                    error: result.errors?.general || result.errors?.email || null,
                    message: null,
                    signupState: result,
                    email: result.email
                }))
            }
        } catch {
            setLocalAlertState(prev => ({
                ...prev,
                error: 'An error occurred during signup',
                message: null,
                signupState: {}
            }))
        }
    }, [])
    // Handle URL message parameters
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
    // Handle URL error parameters
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
    //Reset alert state
    const handleAlertClose = React.useCallback(() => {
        setLocalAlertState(prev => ({
            ...prev,
            error: null,
            message: null,
            showVerificationAlert: false
        }))
    }, [])

    const [SocialAuthState, setSocialAuthState ] = React.useState<SocialAuthState> 
    ({
        redirecting: false,
        provider: undefined
    })
    return(
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
              socialAuthState={SocialAuthState}
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