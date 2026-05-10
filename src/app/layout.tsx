import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Wellness | Premium Supplement & Gummies Store",
    template: "%s | Wellness",
  },
  description:
    "Discover premium wellness gummies and supplements. Clean ingredients, great taste, real results. Immune support, sleep, energy & more.",
  openGraph: {
    title: "Wellness - Premium Supplement Store",
    description: "Discover premium wellness supplements for a healthier lifestyle.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <div className={`${dmSans.variable} ${dmSerif.variable} font-sans contents`} suppressHydrationWarning>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
