import { AlertDefinition } from "@/lib/auth/alerts/auth-alerts";
import { BaseFormState } from "../api";

export interface AuthFormState extends BaseFormState {
  errors?: {
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  };
  verificationPending?: boolean;
  email?: string;
  alert?: AlertDefinition;
}
export interface ResetPasswordFormState extends BaseFormState {
  errors?: {
    email?: string;
    general?: string;
  };
}
export interface UpdatePasswordFormState extends BaseFormState {
  errors?: {
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
}
