import { BaseFormState } from "../api";


export interface AuthFormState extends BaseFormState {
    errors?: {
      fullName?: string
      email?: string
      password?: string
      general?: string
    }
    verificationPending?: boolean
    email?: string
    alert?: AlertDefinition
  }
  