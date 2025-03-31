/**
 * AuthContext: The Authentication State Manager
 * ------------------------------------------
 * Think of this as the security checkpoint that:
 *
 * - Manages Authentication State:
 *   • Tracks current user session
 *   • Handles loading states during auth checks
 *   • Maintains real-time auth status
 *
 * - Provides Global Auth Access:
 *   • Makes user info available throughout the app
 *   • Handles auth state synchronization
 *   • Manages auth status subscriptions
 */
'use client'
import { useContext, useEffect, useState, createContext } from "react";
import { User } from "@supabase/supabase-js"; // Importing the User type from Supabase.
import { createClient } from "@/lib/utils/db/supabase/client"; // Importing the function to create a Supabase client.

// Define the shape of our auth context
interface AuthContextType {
  user: User | null; // Current authenticated user or null if not logged in.
  loading: boolean; // Loading state during authentication checks.
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null, // Default user is null (not authenticated).
  loading: true, // Default loading state is true (auth check in progress).
});

// AuthProvider: A provider component that wraps the app and manages auth state.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to track the current user and loading status
  const [user, setUser] = useState<User | null>(null); // Tracks the authenticated user.
  const [loading, setLoading] = useState(true); // Tracks whether the app is still checking auth state.
  const supabase = createClient(); // Create a Supabase client instance.

  useEffect(() => {
    // Function to check the current session on component mount
    const checkUser = async () => {
      try {
        // Get the current session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null); // Set the user if a session exists, otherwise set to null.
      } catch (error) {
        console.error("Error checking user session:", error); // Log any errors.
        setUser(null); // Set user to null if an error occurs.
      } finally {
        setLoading(false); // Set loading to false after the check is complete.
      }
    };

    checkUser(); // Call the function to check the user session.

    // Set up a real-time listener for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Update the user based on the new session.
      setLoading(false); // Set loading to false after the state change.
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Provide the auth context to the children components
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth: A custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext); // Access the AuthContext.
  if (!context) {
    // Ensure the hook is used within an AuthProvider.
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return the context value (user and loading state).
};
