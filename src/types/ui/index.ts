export enum AlertType {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
  VERIFICATION = "VERIFICATION",
  PASSWORD = "PASSWORD",
  FORM = "FORM",
}

export enum AlertVariant {
  WARNING = "warning",
  CRITICAL = "destructive",
  SUCCESS = "success",
  INFORMATION = "info",
}

export enum AlertStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
}

export interface AlertAction {
    label: string
    handler: () => void
  }
  

export interface AuthAlert {
  type: AlertType;
}
