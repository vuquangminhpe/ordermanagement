"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "@/lib/utils";
import { useAppStore } from "./app-provider";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const { socket, disconnectSocket } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }

    let intervalId: any = null;

    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(intervalId);
          disconnectSocket;
          router.push("/login");
        },
        force,
      });

    const TIMEOUT = 1000 * 60;
    intervalId = setInterval(() => onRefreshToken, TIMEOUT);
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(`${socket?.id} connected`);
    }

    function onDisconnect() {
      console.log(`${socket?.id} disconnected`);
    }
    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);

    return () => {
      clearInterval(intervalId);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, disconnectSocket]);

  return null;
}
