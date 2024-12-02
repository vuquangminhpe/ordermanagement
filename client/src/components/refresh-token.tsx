"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { clearInterval } from "timers";
//NHỮNG PATH KHÔNG CẦN REFRESH TOKEN
const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (!UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        return;
      }
      const decodedAccessToken: any = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken: any = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);
      //trường hợp refresh token hết hạn thì ko xửu lí nữa
      if (decodedRefreshToken.exp <= now) {
        return;
      }
      //ví dụ access token có time hết hạn là 10s
      // => kiểm tra 1/3 thời gian (3s) thì cho refresh token lại
      // time còn lại tính theo CT:decodedAccessToken.exp - now
      // thời gian hết hạn của access token: decodedAccessToken.exp - decodedAccessToken.iat
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        // Goị api refresh token
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };

    checkAndRefreshToken();
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
    //gọi lần đầu tiên , vì interval chạy sau TIMEOUT
    //Time out phải bé hơn thời gian hết hạn của access token
    // ví dụ thời gian hết hạn của access token là 10s thì timeout phải nhỏ hơn 10s
  }, [pathname]);
  return null;
}
