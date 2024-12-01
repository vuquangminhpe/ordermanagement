"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

//NHỮNG PATH KHÔNG CẦN REFRESH TOKEN
const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    if (!UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }
  }, [pathname]);
  return null;
}
