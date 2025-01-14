import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { Viewport } from "next";

import { cn } from "@/lib/utils";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata: Metadata = {
  title: "Lift Archives",
  description: "Your personnal weightlifting journal",
  manifest: "/manifest.json",
  icons: { apple: "/apple-touch-icon.png" },
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(inter.className)}>
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
