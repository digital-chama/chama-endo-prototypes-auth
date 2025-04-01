import { cookies } from "next/headers";
import { createClient } from "@/lib/utils/db/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Handles user login.
 * Authenticates the user using Supabase and redirects to the home page on success.
 *
 * @param formData - The form data submitted by the user, containing email and password fields.
 * @returns An object containing an error message if the login fails.
 */
export async function login(formData: FormData) {
  // Call cookies() to opt out of caching.
  cookies();

  // Create a Supabase client instance to interact with the authentication service.
  const supabase = await createClient();

  // Extract email and password from the form data.
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Attempt to sign in the user with the provided email and password.
  const { error } = await supabase.auth.signInWithPassword(data);

  // Handle authentication errors.
  if (error) {
    return { error: error.message }; // Return the error message if login fails.
  }

  // Revalidate the cache for the root layout to reflect the authenticated state.
  revalidatePath("/", "layout");

  // Redirect the user to the home page after successful login.
  redirect("/");
}

/**
 * Handles user logout.
 * Signs the user out using Supabase and redirects to the login page.
 */
export async function logout() {
  // Call cookies() to opt out of caching.
  cookies();

  // Create a Supabase client instance to interact with the authentication service.
  const supabase = await createClient();

  // Sign the user out.
  await supabase.auth.signOut();

  // Revalidate the cache for the root layout to reflect the unauthenticated state.
  revalidatePath("/", "layout");

  // Redirect the user to the login page after successful logout.
  redirect("/auth/login");
}
