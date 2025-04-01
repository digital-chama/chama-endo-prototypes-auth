import * as React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, checkCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PasswordRequirements,
  validatePassword,
} from "./password-requirements-alert";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showRequirements?: boolean;
  persistentRequirements?: boolean;
  showSuccessMessage?: boolean;
}
export function PasswordInput({
  className,
  showRequirements = false,
  persistentRequirements = false,
  showSuccessMessage = true,
  value = "",
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const isPasswordValid = value ? validatePassword(value.toString()) : false;
  const shouldShowRequirements =
    showRequirements &&
    (persistRequirements
      ? value.toString().length > 0
      : hasInteracted && value.toString().length > 0) &&
    !isPasswordValid;
  return <div className=""></div>;
}
