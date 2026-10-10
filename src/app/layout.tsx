import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "دینار — بانک دیجیتال جهانی | طلا، تتر، تومان",
  description:
    "دینار، نئوبانک نسل جدید: واریز و برداشت با درگاه پرداخت، صدور کارت مجازی، سود ماهانه ۴٪، خرید طلا و حساب چند‌ارزی تتر و دلار. نقشه راه کامل مجوزها از بانک مرکزی تا نئوبانک جهانی.",
  keywords: [
    "نئوبانک",
    "بانک دیجیتال",
    "خرید طلا",
    "تتر",
    "درگاه پرداخت",
    "مجوز بانک مرکزی",
    "کارت مجازی",
    "سود ماهانه",
  ],
  authors: [{ name: "Dinar Labs" }],
  openGraph: {
    title: "دینار — بانک دیجیتال جهانی",
    description:
      "نئوبانک نسل جدید: طلا، تتر، تومان و کارت مجازی در یک اپلیکیشن. با نقشه راه کامل دریافت مجوز.",
    siteName: "Dinar",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "دینار — بانک دیجیتال جهانی",
    description: "نئوبانک نسل جدید: طلا، تتر، تومان و کارت مجازی.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground grain`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
