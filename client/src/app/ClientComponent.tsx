"use client";

import envConfig from "@/config";
import { useEffect } from "react";

export default function ClientComponent() {
  useEffect(() => {
    console.log(envConfig);
  }, []);
  return <div>ClientComponent</div>;
}
