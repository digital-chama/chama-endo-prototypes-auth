import * as React from "react";
import { Input } from "../ui/input"; // Import the Input component for the password field.
import { Button } from "../ui/button"; // Import the Button component for the toggle button.
import { CheckCircle, Eye, EyeOff } from "lucide-react"; // Import icons for showing/hiding the password and success messages.
import { cn } from "@/lib/utils"; // Utility function for conditional class names.
import {
  PasswordRequirements,
  validatePassword,
} from "./password-requirements-alert"; // Import password validation logic and requirements display.

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showRequirements?: boolean; // Whether to show password requirements dynamically.
  persistentRequirements?: boolean; // Whether to always show requirements regardless of interaction.
  showSuccessMessage?: boolean; // Whether to show a success message when the password is valid.
}

/**
 * PasswordInput component.
 * A password input field with features like show/hide password, validation, and dynamic requirements display.
 *
 * @param props - Props for customizing the behavior and appearance of the password input.
 * @returns A JSX element for the password input field.
 */
export function PasswordInput({
  className, // Additional class names for styling the input.
  showRequirements = false, // Default: Do not show requirements unless specified.
  persistentRequirements = false, // Default: Requirements are not persistent.
  showSuccessMessage = true, // Default: Show success message when the password is valid.
  value = "", // The current value of the input field.
  id, // The ID of the input field.
  ...props // Other props passed to the input field.
}: PasswordInputProps) {
  // State to toggle the visibility of the password.
  const [showPassword, setShowPassword] = React.useState(false);

  // State to track whether the user has interacted with the input field.
  const [hasInteracted, setHasInteracted] = React.useState(false);

  // Validate the password using the provided validation function.
  const isPasswordValid = value ? validatePassword(value.toString()) : false;

  // Determine whether to show the password requirements.
  const shouldShowRequirements =
    showRequirements && // Only show requirements if the `showRequirements` prop is true.
    (persistentRequirements
      ? value.toString().length > 0 // Show requirements if there's input (persistent mode).
      : hasInteracted && value.toString().length > 0) && // Show requirements after interaction (non-persistent mode).
    !isPasswordValid; // Only show requirements if the password is invalid.

  return (
    <div>
      {/* Password input field with a toggle button for showing/hiding the password */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"} // Toggle between text and password types.
          className={cn("pr-10", className)} // Add padding for the toggle button and custom class names.
          value={value} // Bind the input value.
          id={id} // Set the input ID.
          onFocus={() => setHasInteracted(true)} // Mark as interacted when the input gains focus.
          onChange={(e) => {
            setHasInteracted(true); // Mark as interacted when the input value changes.
            props.onChange?.(e); // Call the onChange handler passed via props.
          }}
          {...props} // Spread other props onto the input field.
        />
        {/* Button to toggle password visibility */}
        <Button
          type="button"
          variant="ghost" // Use a ghost button style.
          size="sm" // Small button size.
          className="absolute right-0 top-0 h-full px-3 py-3 hover:bg-transparent" // Position the button inside the input field.
          onClick={() => setShowPassword((prev) => !prev)} // Toggle the `showPassword` state.
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" /> // Icon for hiding the password.
          ) : (
            <Eye className="h-4 w-4 text-gray-500" /> // Icon for showing the password.
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"} {/* Screen reader text for accessibility */}
          </span>
        </Button>
      </div>

      {/* Display password requirements or success message */}
      {shouldShowRequirements ? (
        <PasswordRequirements password={value.toString()} /> // Show password requirements if conditions are met.
      ) : (
        showSuccessMessage && // Show success message if enabled.
        value && // Ensure there's a value in the input.
        isPasswordValid && ( // Ensure the password is valid.
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <CheckCircle className="h-4 w-4" /> {/* Success icon */}
            <span className="text-sm">Password meets requirements</span> {/* Success message */}
          </div>
        )
      )}
    </div>
  );
}