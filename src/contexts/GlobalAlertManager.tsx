/**
 * AlertContext: The Alert Command Center
 * ------------------------------------
 * Think of this as the central control room that:
 *
 * - Manages Alert Lifecycle:
 *   • Creates new alerts with unique IDs
 *   • Prevents duplicate alerts
 *   • Removes alerts when they expire
 *   • Clears all alerts when needed
 *
 * - Provides Global Alert Access:
 *   • Makes alerts available throughout the app
 *   • Handles alert state management
 *   • Controls alert timing and duration
 */

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { type AuthAlert } from "@/types/ui";

// Extend AuthAlert type to include a unique identifier
type Alert = AuthAlert & { id: string };

//define the shape of our context
type AlertContextType = {
  alerts: Alert[]; //current active alerts
  addAlert: (alert: AuthAlert) => void; // add new alert
  removeAlert: (id: string) => void; //removing specific alerts
  clearAlerts: () => void; //clear all alerts
};
// Define possible actions for our reducer
type AlertAction =
  | { type: "ADD_ALERT"; payload: Alert } // add new alert
  | { type: "REMOVE_ALERT"; payload: string } //remove by id
  | { type: "CLEAR_ALERTS" }; // remove all alerts

// Create the context with undefined default value
const AlertContext = createContext<AlertContextType | undefined>(undefined);
// Reducer to handle alert state changes
function alertReducer(state: Alert[], action: AlertAction): Alert[] {
  switch (action.type) {
    case "ADD_ALERT":
      // Check for duplicate alerts
      const exists = state.some(
        (alert) =>
          alert.type === action.payload.type &&
          alert.message === action.payload.message
      );
      if (exists) return state;
      return [action.payload]; // Add new alert
    case "REMOVE_ALERT":
      return state.filter((alert) => alert.id !== action.payload); // Remove specific alert
    case "CLEAR_ALERTS":
      return []; // Clear all alerts
    default:
      return state;
  }
}

// Provider component that wraps app and provides alert context
export function AlertProvider({ children }: { children: ReactNode }) {
  // Initialize reducer with empty alerts array
  const [alerts, dispatch] = useReducer(alertReducer, []);
  // Add new alert with unique ID and optional auto-removal
  const addAlert = (alert: AuthAlert) => {
    // Generate random ID for the alert
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: "ADD_ALERT", payload: { ...alert, id } });
    // Set up auto-removal if duration is specified
    if (alert.duration) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_ALERT", payload: id });
      }, alert.duration);
    }
  };

  // Remove specific alert by ID
  const removeAlert = (id: string) => {
    dispatch({ type: "REMOVE_ALERT", payload: id });
  };

  // Clear all active alerts
  const clearAlerts = () => {
    dispatch({ type: "CLEAR_ALERTS" });
  };
  // Provide alert context to children
  return (
    <AlertContext.Provider
      value={{ alerts, addAlert, removeAlert, clearAlerts }}
    >
      {children}
    </AlertContext.Provider>
  );
}

// Custom hook to use alert context
export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
}
