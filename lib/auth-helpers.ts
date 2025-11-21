import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

// Cached so it doesn't spam the DB if used in multiple components on one page
export const getUserRole = cache(async () => {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role as 'superuser' | 'admin' | null;
});