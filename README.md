# cmag-endofin-webapp-prototypes

## Changelog: Version 0.4

### Overview
Version 0.4 introduces a major refactor of the alerting system, transitioning to a React Context API-based solution. This change resolves critical issues with the previous implementation, which suffered from brittle state management, alert conflicts, and complex dependencies. The new system improves maintainability, scalability, and user experience.

### Key Changes
- **Centralized Alert Management**:
  - Replaced tightly coupled alert logic with a global `AlertContext` for managing alert states independently from individual components.
  - Introduced a reusable `EnhancedAlert` component with standardized styling, persistence rules, and clear alert types (e.g., success, warning, error).

- **Authentication Improvements**:
  - Decomposed the monolithic `UserAuthForm` into smaller, focused components like `SignInForm`, `SignUpForm`, and `AuthAlerts`.
  - Added dynamic alerts for authentication scenarios such as email verification, password reset, and login errors.
  - Improved type safety across authentication components with centralized and reusable type definitions.

- **Resolved Alert System Issues**:
  - **Brittle State Management**:
    - Addressed overlapping and interdependent state variables (e.g., `signupState`, `loginState`) that caused unpredictable behaviors.
  - **Conflicting Alerts**:
    - Fixed issues where multiple alerts displayed simultaneously or interfered with each other.
    - Alerts now properly clear when users switch tabs or take new actions.
  - **Complex Conditional Rendering**:
    - Simplified alert conditions with centralized logic, ensuring consistent and predictable behavior.
  - **Persistent Alerts**:
    - Ensured alerts remain visible across navigation or tab switches (e.g., switching between Login and Signup).

- **User Experience Enhancements**:
  - Improved feedback for key actions:
    - Clear alerts for unverified accounts, expired verification links, and successful email verifications.
    - Real-time password validation feedback during signup and reset flows.
  - Enhanced accessibility for alerts and form inputs, ensuring proper label associations and clear feedback.

### Bug Fixes
- **Email Verification**:
  - Fixed incorrect email context in alerts during login or verification flows.
  - Added handling for expired verification links and alerts for already verified emails.
- **Alert Conflicts**:
  - Resolved issues with overlapping or disappearing alerts, ensuring only relevant alerts display for the user’s current action.
- **Form Persistence**:
  - Fixed issues where form data reset unexpectedly during tab switches or after errors.

### Technical Updates
- **Modular Architecture**:
  - Refactored the alerting system into modular components for better scalability and reuse.
  - Introduced `useReducer` for predictable and maintainable state transitions.
- **Improved Testing**:
  - Enhanced test coverage for alerting and authentication flows.
  - Simplified debugging with centralized logic and clear type definitions.

This update resolves critical issues with the old alerting system, ensuring robust, maintainable, and user-friendly authentication workflows moving forward.