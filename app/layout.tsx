// app/layout.tsx
import "./globals.css";                    // ✅ add/keep this at the VERY top
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Design&Cart",
  description: "Designers collaborate, approve renders, and shop products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#efeee9]">
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
