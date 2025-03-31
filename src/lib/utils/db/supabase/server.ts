import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (error: unknown) {
            // Ignore cookie error in middleware
            console.debug("Cookie set error:", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, "", options);
          } catch (error: unknown) {
            // Ignore cookie error in middleware
            console.debug("Cookie remove error:", error);
          }
        },
      },
    }
  );
}
