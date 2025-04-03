/**
 * EnhancedAlert: The Alert UI Component
 * -----------------------------------
 * Think of this as a versatile alert display that:
 * 
 * - Manages Alert Presentation:
 *   • Displays different alert types (warning, error, success, info)
 *   • Handles custom styling per variant
 *   • Manages icon and color schemes
 * 
 * - Handles Interactive Elements:
 *   • Optional close buttons
 *   • Action buttons
 *   • Email verification resend
 * 
 * - Maintains Consistent Styling:
 *   • Variant-specific colors
 *   • Responsive layout
 *   • Accessible design
 */

import * as React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AlertVariant, type EnhancedAlertProps } from '@/types'
import { Button } from '../ui/button'
import { ResendEmailButton } from './resend-email-button'

//define styling configurations for each alert variant
const variantStyles = {
    [AlertVariant.WARNING]:
    {
        container: 'bg-orange-50 border-orange-200',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        component: AlertTriangle

    },
    [AlertVariant.CRITICAL]:
    {
        container: 'bg-red-50 text-destructive',
        icon: 'text-destructive',
        title: 'text-destructive',
        component: AlertCircle

    },
    [AlertVariant.SUCCESS]:
    {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        component: CheckCircle
    },
    [AlertVariant.INFORMATION]:
    {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        component: Info
    }
}

export function EnhancedAlert({
    title,                    // Alert heading
    message,                  // Alert content
    variant,                  // Visual style variant
    action,                   // Optional action button
    onClose,                  // Close handler
    className,               // Additional CSS classes
    showTitle = true,        // Toggle title visibility
    showCloseButton = true,  // Toggle close button
    resendVerificationEmail  // Email verification config
}: EnhancedAlertProps)

{
    //get variant-specific styles
    const styles = variantStyles[variant]
    const IconComponent = styles.component

    return(
        //Main alert container with variant styling
        <Alert className={cn(styles.container, "relative p-3", className)}>
        <div className="flex">
          {/* Variant-specific icon */}
          <IconComponent className={cn("h-4 w-4 shrink-0 mt-0.5", styles.icon)} />
          
          {/* Alert content container */}
          <div className="ml-3 flex-1 text-left">
            {/* Conditional title rendering */}
            {showTitle && title && (
              <AlertTitle className={cn("font-bold leading-none", styles.title)}>
                {title}
              </AlertTitle>
            )}
            
            {/* Alert message and interactive elements */}
            <AlertDescription className="text-sm mt-1.5">
              {message}
              {/* Optional action button */}
              {action && (
                <Button
                  variant="link"
                  className="px-0 ml-1 h-auto"
                  onClick={action.handler}
                >
                  {action.label}
                </Button>
              )}
              {/* Optional email verification button */}
              {resendVerificationEmail?.enabled && (
                <ResendEmailButton
                  email={resendVerificationEmail.email}
                  onResendSuccess={resendVerificationEmail.onResendSuccess}
                  onResendError={resendVerificationEmail.onResendError}
                />
              )}
            </AlertDescription>
          </div>
  
          {/* Optional close button */}
          {onClose && showCloseButton && (
            <button
              type="button"
              className={cn("h-4 w-4 shrink-0", styles.icon)}
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Alert>
    )

}