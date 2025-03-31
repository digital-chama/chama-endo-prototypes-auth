import { cookies } from "next/headers";
import { cache } from "react";
import type { Tables } from "@/types";
import { createClient } from "@/lib/utils/db/supabase/server";

export const getUser = cache(async () => {
  cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getUserDetails = cache(async (userId: string) => {
  cookies();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as Tables<"users">;
  } catch (error) {
    console.error("Error in getUserDetails", error);
  }
});
