import * as React from "react";
import { Check, X, Info } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { isValidPassword } from "@/lib/utils/auth/password-validation";

interface PasswordRequirement {
  text: string;
  isMet: boolean;
}
interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    {
      text: "Be between 12 and 123 characters long",
      isMet: password.length >= 12 && password.length <= 123,
    },
    {
      text: "Contain at least one lowercase letter (a-z)",
      isMet: /[a-z]/.test(password),
    },
    {
      text: "Contain at least one uppercase letter (A-Z)",
      isMet: /[A-Z]/.test(password),
    },
    {
      text: "Contain at least one number (0-9)",
      isMet: /[0-9]/.test(password),
    },
    {
      text: "Contain at least one special character (!@#$%^&*)",
      isMet: /[!@#$%^&*]/.test(password),
    },
  ];
  return (
    <Alert className="mt-3 bg-muted/50">
      <div className="relative pl-6 mb-2">
        <Info className="absolute left-0 top-[-2px] h-4 w-4 text-foreground" />
        <AlertTitle className="font-bold text-foreground">
          Password Must
        </AlertTitle>
      </div>
      <div className="space-y-1">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              requirement.isMet ? "text-green-600" : "text-red-500"
            }`}
          >
            {requirement.isMet ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <X className="h-4 w-4 shrink-0" />
            )}
            <span>{requirement.text}</span>
          </div>
        ))}
      </div>
    </Alert>
  );
}
// Export the utility function for use in password-input.tsx
export {isValidPassword as validatePassword}
