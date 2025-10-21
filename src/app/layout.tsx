import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graph",
  description: "Apis inneo.org",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
