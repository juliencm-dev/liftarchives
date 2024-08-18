import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiftArchives",
  description: "Your personnal weightlifting journal",
  manifest: "/manifest.json",
  icons: { apple: "/apple-touch-icon.png" },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className={cn(inter.className)}>
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
