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



import React,{createContext, useContext, useReducer, ReactNode} from "react";
