import accountApiRequest from "@/apiRequests/account.api";
import { cookies } from "next/headers";
import React from "react";

export default async function dashboard() {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  let name = "";
  try {
    const data = accountApiRequest.sMe(accessToken as string);

    name = (await data).payload.data.name;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return <div className="ml-5">dashboard {name}</div>;
}
