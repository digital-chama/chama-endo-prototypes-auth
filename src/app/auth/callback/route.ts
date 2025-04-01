import { createClient } from "@/lib/utils/db/supabase/server"; // Import Supabase client creation utility.
import { NextResponse } from "next/server"; // Import Next.js server utilities for handling responses.
import { AuthError } from "@supabase/supabase-js"; // Import Supabase authentication error class for error handling.

/**
 * Handles GET requests for the authentication callback route.
 * This route processes email verification, password recovery, and OAuth callbacks.
 *
 * @param request - The incoming HTTP request object.
 * @returns A NextResponse object to handle redirection or errors.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url); // Parse the request URL for query parameters and path.
  const error = requestUrl.searchParams.get("error"); // Extract the "error" query parameter, if present.
  const error_description = requestUrl.searchParams.get("error_description"); // Extract the "error_description" query parameter, if present.
  const code = requestUrl.searchParams.get("code"); // Extract the "code" query parameter for session exchange.
  const type = requestUrl.searchParams.get("type"); // Extract the "type" query parameter (e.g., "recovery", "oauth").
  const email_verify = requestUrl.searchParams.get("email_verify"); // Extract the "email_verify" query parameter for email verification.

  // Handle expired verification links.
  if (error && error_description?.includes("expired")) {
    if (email_verify) {
      const supabase = await createClient(); // Create a Supabase client instance.
      const { data } = await supabase.rpc("check_user_verification", {
        user_email: email_verify, // Call a Supabase RPC function to check if the user is already verified.
      });

      // If the user is already verified, redirect to the login page with a success message.
      if (Array.isArray(data) && data[0]?.is_verified === true) {
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?message=already_verified&email=${email_verify}`
        );
      }
    }

    // Redirect to the login page with an error message for expired verification.
    const redirectUrl = new URL(`${requestUrl.origin}/auth/login`);
    redirectUrl.searchParams.set("error", "verification_expired");
    if (email_verify) {
      redirectUrl.searchParams.set("email", email_verify);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Handle session exchange using the provided code.
  if (code) {
    const supabase = await createClient(); // Create a Supabase client instance.

    // Check if the user is already verified.
    const {
      data: { user },
    } = await supabase.auth.getUser(code); // Retrieve the user associated with the provided code.
    if (user?.email_confirmed_at) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?message=already_verified`
      );
    }

    try {
      // Attempt to exchange the code for a session.
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      // Handle errors during session exchange.
      if (error) {
        if (
          error instanceof AuthError &&
          (error.message.includes("flow state") ||
            error.message.includes("code verifier") ||
            error.message.includes("expired"))
        ) {
          // Handle specific errors related to code verification or expiration.
          if (email_verify) {
            const { data } = await supabase.rpc("check_user_verification", {
              user_email: email_verify, // Check if the user is verified in a different browser.
            });

            if (process.env.NODE_ENV === "development") {
              console.log("Verification status check:", { data, email_verify });
            }

            if (Array.isArray(data) && data[0]?.is_verified === true) {
              return NextResponse.redirect(
                `${requestUrl.origin}/auth/login?message=verified_different_browser&email=${email_verify}`
              );
            }
          }
        }

        // Redirect to the login page with an error message for verification failure.
        if (error instanceof AuthError) {
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/login?error=Could not verify email: ${error.message}`
          );
        }
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=Could not verify email: An unexpected error occurred`
        );
      }

      // Handle password recovery flow.
      if (type === "recovery") {
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/reset-password`
        );
      }

      // Handle OAuth callback flow.
      if (type === "oauth") {
        const next = requestUrl.searchParams.get("next") ?? "/"; // Get the "next" parameter or default to the home page.
        const forwardedHost = request.headers.get("x-forwarded-host"); // Get the forwarded host header for load balancer support.
        const isLocalEnv = process.env.NODE_ENV === "development"; // Check if the environment is local.

        // Retrieve the current user and session data.
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (process.env.NODE_ENV === "development") {
          console.log(
            "[OAuth Callback] Provider:",
            user?.app_metadata?.provider
          );
          console.log(
            "[OAuth Callback] Has provider token:",
            !!session?.provider_token
          );
        }

        // Handle provider-specific avatar URLs.
        if (user?.app_metadata?.provider) {
          const baseUrl = isLocalEnv
            ? requestUrl.origin
            : `https://${forwardedHost}`;
          let proxyUrl: string | undefined;

          switch (user.app_metadata.provider) {
            case "azure":
            case "microsoft":
              proxyUrl = `${baseUrl}/api/auth/microsoft/photo`; // Proxy URL for Microsoft avatars.
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "[OAuth Callback] Setting Microsoft photo URL:",
                  proxyUrl
                );
              }
              break;
            case "google":
              proxyUrl = user.user_metadata?.avatar_url; // Google provides the avatar URL directly.
              break;
          }

          if (proxyUrl) {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "[OAuth Callback] Updating user with avatar URL:",
                proxyUrl
              );
            }
            await supabase.auth.updateUser({
              data: {
                avatar_url: proxyUrl, // Update the user's avatar URL.
              },
            });
          }
        }

        // Redirect based on the environment and forwarded host.
        if (isLocalEnv) {
          return NextResponse.redirect(`${requestUrl.origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${requestUrl.origin}${next}`);
        }
      }

      // Sign out the user after successful verification.
      await supabase.auth.signOut();

      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?message=verification_success`
      );
    } catch (error: unknown) {
      // Handle unexpected errors during session exchange.
      if (error instanceof AuthError) {
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=Could not verify email: ${error.message}`
        );
      }
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=Could not verify email: An unexpected error occurred`
      );
    }
  }

  // Redirect to the login page with an error message for expired verification.
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/login?error=verification_expired`
  );
}
