import { envConfig } from "@/configs/env.config";
import type { MetadataRoute } from "next";
import { cookies } from "next/headers";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookie = await cookies();
  const theme = cookie.get("theme");
  const bg_color = theme?.value == "light" ? "#01011E" : "#FFFFFF";
  const text_color = theme?.value == "light" ? "#FFFFFF" : "#01011E";
  const schoolNameFull: string = envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL;
  return {
    name: `${schoolNameFull}`,
    short_name: `${schoolNameFull}`,
    description: `School management system for ${schoolNameFull}. Automate student records, timetables, payments, and more.`,
    start_url: "/",
    display: "standalone",
    background_color: bg_color,
    theme_color: text_color,
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
