import type { Metadata } from "next";
import { AppChrome } from "@/components/shared/app-chrome";
import { CartProvider } from "@/providers/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catring Healthy Catering",
  description: "Website catering modern dengan dashboard admin dan sistem order WhatsApp."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
