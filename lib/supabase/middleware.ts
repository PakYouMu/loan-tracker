import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Initialize the response object
  // We need this to be able to set cookies on the outgoing response
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Create the Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // This updates the request cookies (for the current server run)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // This updates the response cookies (to be sent to the browser)
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Run the Auth Check IMMEDIATELY
  // This satisfies the warning. We run this right after client creation.
  // getUser() is safer than getClaims() because it validates the user is not banned.
  const { data: { user } } = await supabase.auth.getUser();

  // 4. RBAC & Protected Route Logic
  const path = request.nextUrl.pathname;

  // LOGIC: If user is NOT logged in, but trying to access protected pages
  // (Exclude /auth/* routes so they can actually log in)
  if (
    !user &&
    !path.startsWith("/auth") &&
    !path.startsWith("/login") &&
    path !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // LOGIC: If user IS logged in, but trying to access public Auth pages
  // (Redirect them to the dashboard so they don't login twice)
  if (user && (path.startsWith("/auth/login") || path === "/login" || path === "/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 5. Return the response (Crucial for saving the refreshed cookie)
  return supabaseResponse;
}