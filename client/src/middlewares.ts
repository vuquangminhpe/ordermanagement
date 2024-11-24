import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];
export default async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  console.log(pathname);
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
