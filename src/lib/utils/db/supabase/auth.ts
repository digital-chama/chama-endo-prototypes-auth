import { cookies } from "next/headers"; // Importing cookies utility from Next.js for handling cookies.
import { cache } from "react"; // Importing cache utility from React for memoization.
import type { Tables } from "@/types"; // Importing the Tables type for type safety.
import { createClient } from "@/lib/utils/db/supabase/server"; // Importing the function to create a Supabase client.

// getUser retrieves the currently authenticated user from Supabase.
// It uses the cache function to memoize the result for performance optimization.
export const getUser = cache(async () => {
  cookies(); // Access cookies (required for Supabase authentication).
  const supabase = await createClient(); // Create a Supabase client instance.

  // Fetch the currently authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user; // Return the user object.
});

// getUserDetails retrieves detailed information about a specific user from the "users" table.
// - userId: The ID of the user to fetch details for.
// It uses the cache function to memoize the result for performance optimization.
export const getUserDetails = cache(async (userId: string) => {
  cookies(); // Access cookies (required for Supabase authentication).
  const supabase = await createClient(); // Create a Supabase client instance.

  try {
    // Query the "users" table for the user with the specified ID.
    const { data, error } = await supabase
      .from("users") // Specify the "users" table.
      .select("*") // Select all columns.
      .eq("id", userId) // Filter by the user ID.
      .single(); // Ensure only a single record is returned.

    if (error) throw error; // Throw an error if the query fails.

    return data as Tables<"users">; // Return the user data, typed as Tables<"users">.
  } catch (error) {
    // Log any errors that occur during the query.
    console.error("Error in getUserDetails", error);
  }
});
