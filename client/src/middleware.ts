import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const unAuthPaths = ["/login"];
const managePaths = ["/manage"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...unAuthPaths];
const guestPaths = ["/guest"];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // chưa đăng nhập thì ko cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    if (!pathname.startsWith("/login")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("clearTokens", "true");
      return NextResponse.redirect(url);
    }
  }
  //trường hợp đã đăng nhập
  if (refreshToken) {
    //2.1 nếu cố tình vào login thì redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    //2.2 đã đăng nhập nhưng access token hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken &&
      refreshToken
    ) {
      const url = new URL("/refresh-token", req.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //2.3 Vào không đúng route thì redirect về trang chủ
    const role = decodeToken(refreshToken).role;

    //Guest nhưng cố vào route owner
    const isGuestGotoManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    //ko phải Guest nhưng có vào route guest
    const isNotGuestGotoGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    const isNotOwnerGotoOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (
      isGuestGotoManagePath ||
      isNotGuestGotoGuestPath ||
      isNotOwnerGotoOwnerPath
    ) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
