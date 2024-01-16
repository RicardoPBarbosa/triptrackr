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

    if (error) {
      response.cookies.delete(
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_REF_ID}-auth-token.0`,
      );
      response.cookies.delete(
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_REF_ID}-auth-token.1`,
      );
      return ["error", response];
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
