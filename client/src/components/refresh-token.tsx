"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "@/lib/utils";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }

    let intervalId: any = null;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(intervalId);

        router.push("/login");
      },
    });

    const TIMEOUT = 1000 * 60;
    intervalId = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(intervalId);
            router.push("/login");
          },
        }),
      TIMEOUT
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname, router]);

  return null;
}
