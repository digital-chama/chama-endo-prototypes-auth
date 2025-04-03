/**
 * AlertContainer: The Alert Message Display Manager
 * ----------------------------------------------
 * Think of this as a bulletin board that:
 * 
 * - Displays All Active Alerts:
 *   • Shows alerts in a neat grid layout
 *   • Handles multiple alerts at once
 *   • Maintains proper spacing between alerts
 * 
 * - Manages Alert Lifecycle:
 *   • Removes alerts when closed
 *   • Notifies parent when alerts change
 *   • Handles persistent vs dismissible alerts
 * 
 * - Visual Presentation:
 *   • Consistent spacing with gap-4
 *   • Responsive grid layout
 *   • Customizable via className prop
 */

import { EnhancedAlert } from './auth-alert-ui'
import { useAlerts } from '@/contexts/GlobalAlertManager'
import { cn } from '@/lib/utils'
import { type AuthAlert } from '@/types'

// Extend AuthAlert type to include unique identifier for React keys
type Alert = AuthAlert & { id: string }

// Define component props with optional styling and callback
interface AlertContainerProps {
  className?: string                // Optional CSS classes for container customization
  onAlertClose?: () => void        // Optional callback for alert closure notifications
}

export function AlertContainer({ className, onAlertClose }: AlertContainerProps) {
  // Get alerts and removal function from global alert context
  const { alerts, removeAlert } = useAlerts()

  // Handle alert closure with optional parent notification
  const handleClose = (id: string) => {
    removeAlert(id)                 // Remove alert from global state
    onAlertClose?.()               // Notify parent component if callback provided
  }

  return (
    // Container with grid layout for multiple alerts
    <div className={cn("grid gap-4", className)}>
      {/* Map through and render each active alert */}
      {alerts.map((alert: Alert) => (
        <EnhancedAlert
          key={alert.id}                           // Unique identifier for React reconciliation
          title={alert.title}                      // Alert heading text
          message={alert.message}                  // Alert main content
          variant={alert.variant}                  // Visual style (warning/error/success/info)
          action={alert.action}                    // Optional action button config
          onClose={() => handleClose(alert.id)}    // Close handler with alert ID
          showCloseButton={!alert.persist}      // Toggle close button based on persistence
          resendVerificationEmail={alert.resendVerificationEmail}  // Email verification config
        />
      ))}
    </div>
  )
} 