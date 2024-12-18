"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "@/lib/utils";

const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const runTokenRefresh = () => {
      checkAndRefreshToken({
        onError: () => {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        },
      });
    };

    runTokenRefresh();

    const TIMEOUT = 1000 * 60;
    intervalId = setInterval(runTokenRefresh, TIMEOUT);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [pathname]);

  return null;
}
