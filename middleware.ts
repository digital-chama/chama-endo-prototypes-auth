import { createServerClient, CookieOptions } from "@supabase/ssr"; // Import Supabase server-side rendering utilities.
import { NextResponse, type NextRequest } from "next/server"; // Import Next.js server utilities for handling requests and responses.

/**
 * Middleware function to handle authentication and route protection.
 * This middleware ensures that only authenticated users can access certain routes
 * and redirects unauthenticated users to the login page.
 *
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse object to handle the request.
 */
export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes.
  // This ensures that middleware does not interfere with requests for static assets or API endpoints.
  if (
    request.nextUrl.pathname.startsWith("/_next") || // Skip Next.js internal files.
    request.nextUrl.pathname.startsWith("/api") || // Skip API routes.
    request.nextUrl.pathname.includes("favicon.ico") // Skip favicon requests.
  ) {
    return NextResponse.next(); // Allow the request to proceed without middleware intervention.
  }

  // Clone the request URL to preserve query parameters for further processing.
  const requestUrl = request.nextUrl.clone();

  // Initialize a response object to modify cookies or handle redirection.
  let response = NextResponse.next({ request });

  // Create a Supabase client instance to interact with the authentication service.
  // The client uses environment variables for the Supabase URL and anonymous key.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anonymous key.
    {
      cookies: {
        // Define how cookies are handled in the middleware.
        get(name: string) {
          // Retrieve a cookie value by its name.
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set a cookie with the specified name, value, and options.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Update the response object to include the new cookie.
          response = NextResponse.next({
            request,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Remove a cookie by its name.
          request.cookies.delete(name);
          // Update the response object to reflect the removed cookie.
          response = NextResponse.next({
            request,
          });
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  // Retrieve the authenticated user from Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract the current request path.
  const path = requestUrl.pathname;

  // Allow access to authentication-related routes (e.g., login, signup).
  if (path.startsWith("/auth")) {
    // If the user is already authenticated and tries to access the login page, redirect them to the home page.
    if (user && path === "/auth/login") {
      return NextResponse.redirect(new URL("/", requestUrl)); // Redirect to the home page.
    }
    return response; // Allow access to other authentication-related routes.
  }

  // For all other pages, require authentication.
  if (!user) {
    // If the user is not authenticated, redirect them to the login page.
    const redirectUrl = new URL("/auth/login", request.url); // Construct the login page URL.
    redirectUrl.searchParams.set("redirect_to", path); // Add the current path as a query parameter for redirection after login.
    return NextResponse.redirect(redirectUrl); // Redirect to the login page.
  }

  // If the user is authenticated, allow the request to proceed.
  return response;
}

/**
 * Configuration for the middleware.
 * Specifies which paths the middleware should apply to.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)", // Exclude specific paths from middleware processing.
  ],
};
