import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuth = Boolean(req.cookies.get("accessToken")?.value);

  // chưa đăng nhập thì ko cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // chưa đăng nhập thì ko cho vào login, register paths

  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
