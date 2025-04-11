import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WeightUnitProvider } from "@/contexts/WeightUnitContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weight Tracker",
  description: "Track your weight and fitness journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WeightUnitProvider>{children}</WeightUnitProvider>
      </body>
    </html>
  );
}
