import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    const { error } = await supabase.auth.getSession();

    if (error?.message.match("Invalid Refresh Token")) {
      const allCookies = request.cookies.getAll();
      allCookies.forEach((cookie) => {
        // Delete all Supabase cookies starting with 'sb-'
        if (cookie.name.startsWith("sb-")) {
          response.cookies.delete(cookie.name);
        }
      });
    }

    return response;
  } catch (error) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
