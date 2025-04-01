/**
 * Auth Alerts: The Alert Message Template Library
 * --------------------------------------------
 * Think of this as a comprehensive message catalog that:
 * 
 * - Defines All Possible Alert Messages:
 *   • Login-related messages (success, errors)
 *   • Signup-related messages (confirmations, duplicates)
 *   • Verification messages (email checks, resend confirmations)
 *   • Password-related messages (reset, update statuses)
 *   • Form validation messages (input requirements)
 * 
 * - Provides Message Creation Tools:
 *   • Helper function to create consistent alerts
 *   • Handles message customization (like email placeholders)
 *   • Ensures consistent styling and behavior
 */

import { AlertType, AlertStatus, AlertVariant, type AuthAlert } from '@/types'

// Define the basic structure of an alert message
export type AlertDefinition = {
  type: AlertType
  status: AlertStatus
  title: string
  message: string
  variant: AlertVariant
  action?: AuthAlert['action']
  resendVerificationEmail?: AuthAlert['resendVerificationEmail']
}

// Define the structure of our alerts
export type AlertsConfig = {
  LOGIN: {
    SUCCESS: AlertDefinition
    ERROR: AlertDefinition
    VERIFICATION_REQUIRED: AlertDefinition
    REDIRECT_MICROSOFT: AlertDefinition
    REDIRECT_GOOGLE: AlertDefinition
    REDIRECT_GITHUB: AlertDefinition
  }
  SIGNUP: {
    SUCCESS: AlertDefinition
    ACCOUNT_EXISTS: AlertDefinition
    ACCOUNT_EXISTS_UNVERIFIED: AlertDefinition
    ERROR: AlertDefinition
  }
  VERIFICATION: {
    SUCCESS: AlertDefinition
    ALREADY_VERIFIED: AlertDefinition
    EXPIRED: AlertDefinition
    PENDING: AlertDefinition
    RESEND_SUCCESS: AlertDefinition
    RESEND_ERROR: AlertDefinition
    VERIFIED_DIFFERENT_BROWSER: AlertDefinition
  }
  PASSWORD: {
    RESET_SUCCESS: AlertDefinition
    RESET_ERROR: AlertDefinition
    UPDATE_SUCCESS: AlertDefinition
    UPDATE_ERROR: AlertDefinition
    LINK_EXPIRED: AlertDefinition
  }
  FORM: {
    VALIDATION: {
      FULL_NAME_REQUIRED: AlertDefinition
      EMAIL_REQUIRED: AlertDefinition
      PASSWORD_REQUIREMENTS: AlertDefinition
      PASSWORD_MIN_LENGTH: AlertDefinition
      PASSWORDS_DONT_MATCH: AlertDefinition
    }
  }
}

// Helper function to create customized alert messages
export function createAuthAlert<
  TCategory extends keyof AlertsConfig,
  TType extends TCategory extends 'FORM' 
    ? keyof AlertsConfig['FORM']['VALIDATION']
    : keyof AlertsConfig[TCategory]
>(
  category: TCategory,
  type: TType,
  customProps?: Partial<Pick<AlertDefinition, 'message' | 'action' | 'resendVerificationEmail'>>
): AlertDefinition {
  // Get base alert template based on category
  const baseAlert = category === 'FORM'
    ? (AUTH_ALERTS.FORM.VALIDATION[type as keyof AlertsConfig['FORM']['VALIDATION']] as AlertDefinition)
    : (AUTH_ALERTS[category][type as keyof AlertsConfig[TCategory]] as AlertDefinition)

  // Replace email placeholder in message if provided
  const message = baseAlert.message.replace(
    '${email}',
    customProps?.resendVerificationEmail?.email || 'unknown'
  )

  return {
    type: baseAlert.type,
    status: baseAlert.status,
    title: baseAlert.title,
    message,
    variant: baseAlert.variant,
    action: customProps?.action,
    resendVerificationEmail: customProps?.resendVerificationEmail
  }
}

// Complete catalog of all possible alert messages
export const AUTH_ALERTS: AlertsConfig = {
  // Login-related alerts
  LOGIN: {
    SUCCESS: {
      type: AlertType.LOGIN,
      status: AlertStatus.SUCCESS,
      title: 'Welcome Back',
      message: 'Successfully logged in. Redirecting...',
      variant: AlertVariant.SUCCESS,
    },
    ERROR: {
      type: AlertType.LOGIN,
      status: AlertStatus.ERROR,
      title: 'Invalid Credentials',
      message: 'Wrong email or password.',
      variant: AlertVariant.CRITICAL,
    },
    VERIFICATION_REQUIRED: {
      type: AlertType.LOGIN,
      status: AlertStatus.WARNING,
      title: 'Verify Your Email',
      message: 'We sent an email to ${email}. Click the link inside to get started.',
      variant: AlertVariant.WARNING,
    },
    REDIRECT_MICROSOFT: {
      type: AlertType.LOGIN,
      status: AlertStatus.INFO,
      title: 'Redirecting',
      message: 'Redirecting to Microsoft login...',
      variant: AlertVariant.INFORMATION
    },
    REDIRECT_GOOGLE: {
      type: AlertType.LOGIN,
      status: AlertStatus.INFO,
      title: 'Redirecting',
      message: 'Redirecting to Google login...',
      variant: AlertVariant.INFORMATION
    },
    REDIRECT_GITHUB: {
      type: AlertType.LOGIN,
      status: AlertStatus.INFO,
      title: 'Redirecting',
      message: 'Redirecting to GitHub login...',
      variant: AlertVariant.INFORMATION
    }
  },
  // Signup-related alerts
  SIGNUP: {
    SUCCESS: {
      type: AlertType.SIGNUP,
      status: AlertStatus.INFO,
      title: 'Verify Your Email',
      message: 'We sent an email to ${email}. Click the link inside to get started.',
      variant: AlertVariant.INFORMATION,
    },
    ACCOUNT_EXISTS: {
      type: AlertType.SIGNUP,
      status: AlertStatus.WARNING,
      title: "Account Already Exists",
      message: "An account with this email already exists.",
      variant: AlertVariant.WARNING,
    },
    ACCOUNT_EXISTS_UNVERIFIED: {
      type: AlertType.SIGNUP,
      status: AlertStatus.WARNING,
      title: "Account Already Exists",
      message: "An account with this email already exists. If you recently signed up, please check your email for a verification link.",
      variant: AlertVariant.WARNING,
    },
    ERROR: {
      type: AlertType.SIGNUP,
      status: AlertStatus.ERROR,
      title: 'Signup Failed',
      message: 'An error occurred during signup',
      variant: AlertVariant.CRITICAL,
    }
  },
  // Email verification alerts
  VERIFICATION: {
    SUCCESS: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.SUCCESS,
      title: 'Email Verified',
      message: 'Your email has been verified successfully. You can now log in.',
      variant: AlertVariant.SUCCESS,
    },
    ALREADY_VERIFIED: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.SUCCESS,
      title: 'Already Verified',
      message: 'Your email has already been verified. You can now log in.',
      variant: AlertVariant.SUCCESS,
    },
    EXPIRED: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.WARNING,
      title: 'Verification Link Expired',
      message: 'Your verification link has expired. Click the link to get a new verification email.',
      variant: AlertVariant.WARNING,
    },
    PENDING: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.INFO,
      title: 'Verification Required',
      message: 'Please check your email to verify your account',
      variant: AlertVariant.INFORMATION,
    },
    RESEND_SUCCESS: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.SUCCESS,
      title: 'Email Sent',
      message: 'Verification email has been resent',
      variant: AlertVariant.SUCCESS,
    },
    RESEND_ERROR: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.ERROR,
      title: 'Email Failed',
      message: 'Could not resend verification email',
      variant: AlertVariant.CRITICAL,
    },
    VERIFIED_DIFFERENT_BROWSER: {
      type: AlertType.VERIFICATION,
      status: AlertStatus.SUCCESS,
      title: 'Email Verified',
      message: 'Your email was verified but you are no longer authenticated. Please return to the device where you began sign up and proceed with login, or login on this device to continue.',
      variant: AlertVariant.SUCCESS,
    },
  },
  // Password-related alerts
  PASSWORD: {
    RESET_SUCCESS: {
      type: AlertType.PASSWORD,
      status: AlertStatus.SUCCESS,
      title: 'Reset Email Sent',
      message: 'Check your email for password reset instructions',
      variant: AlertVariant.SUCCESS,
    },
    RESET_ERROR: {
      type: AlertType.PASSWORD,
      status: AlertStatus.ERROR,
      title: 'Reset Failed',
      message: 'Unable to send reset instructions',
      variant: AlertVariant.CRITICAL,
    },
    UPDATE_SUCCESS: {
      type: AlertType.PASSWORD,
      status: AlertStatus.SUCCESS,
      title: 'Password Updated',
      message: 'Your password has been updated successfully',
      variant: AlertVariant.SUCCESS,
    },
    UPDATE_ERROR: {
      type: AlertType.PASSWORD,
      status: AlertStatus.ERROR,
      title: 'Update Failed',
      message: 'Unable to update password',
      variant: AlertVariant.CRITICAL,
    },
    LINK_EXPIRED: {
      type: AlertType.PASSWORD,
      status: AlertStatus.ERROR,
      title: 'Link Expired',
      message: 'Your password reset link has expired',
      variant: AlertVariant.CRITICAL,
    }
  },
  // Form validation alerts
  FORM: {
    VALIDATION: {
      FULL_NAME_REQUIRED: {
        type: AlertType.FORM,
        status: AlertStatus.ERROR,
        title: 'Invalid Input',
        message: 'Please enter your full name',
        variant: AlertVariant.CRITICAL,
      },
      EMAIL_REQUIRED: {
        type: AlertType.FORM,
        status: AlertStatus.ERROR,
        title: 'Invalid Input',
        message: 'Please enter a valid email address',
        variant: AlertVariant.CRITICAL,
      },
      PASSWORD_REQUIREMENTS: {
        type: AlertType.FORM,
        status: AlertStatus.ERROR,
        title: 'Invalid Input',
        message: 'Password must meet all requirements',
        variant: AlertVariant.CRITICAL, 
      },
      PASSWORD_MIN_LENGTH: {
        type: AlertType.FORM,
        status: AlertStatus.ERROR,
        title: 'Invalid Input',
        message: 'Password must be at least 8 characters',
        variant: AlertVariant.CRITICAL,
      },
      PASSWORDS_DONT_MATCH: {
        type: AlertType.FORM,
        status: AlertStatus.ERROR,
        title: 'Invalid Input',
        message: 'Passwords do not match',
        variant: AlertVariant.CRITICAL,
      }
    }
  }
} as const 