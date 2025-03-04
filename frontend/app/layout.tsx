import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/authProvider";
import { AppointmentsProvider } from "@/providers/appointmentsProvider";

export const metadata: Metadata = {
  title: "Salão Leila",
  description: "Cabelereira Leila",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased `} cz-shortcut-listen="false">
        <AuthProvider>
          <AppointmentsProvider>{children}</AppointmentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
