import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/authProvider";

export const metadata: Metadata = {
  title: "Teste DSIN",
  description: "Cabelereira Leila",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased `}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
