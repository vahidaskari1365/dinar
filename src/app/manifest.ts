import type { MetadataRoute } from "next";

/**
 * PWA manifest — served at /manifest.webmanifest
 * Makes Dinar installable on Android/desktop Chrome and tablets.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "دینار — بانک دیجیتال جهانی",
    short_name: "دینار",
    description:
      "نئوبانک چندارزی: واریز و برداشت لحظه‌ای، حساب طلا و تتر و تومان، کارت مجازی و پاداش نگهداشت ماهانه.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "rtl",
    lang: "fa",
    background_color: "#0a1612",
    theme_color: "#0a1612",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
