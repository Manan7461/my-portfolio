import type { Metadata } from "next";
import { JetBrains_Mono, Inter_Tight, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import LenisProvider from "@/components/LenisProvider";
import { LoaderProvider } from "@/components/LoaderContext";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import FooterOverlay from "@/components/FooterOverlay";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

// Display — tight, heavy grotesk for big headlines
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Editorial italic accent
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Body — clean neutral sans (bundled locally)
const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prajapati Manan — Portfolio",
  description: "AI-Assisted Engineer. Think. Build. Optimize. Gujarat, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('loader-active');
            `,
          }}
        />
      </head>
      <body
        className={`${jetbrains.variable} ${display.variable} ${instrument.variable} ${geist.variable} antialiased`}
      >
        <LenisProvider>
          <LoaderProvider>
            <Cursor />
            <div className="main-content">
              <Navbar />
              {children}
              <FooterOverlay />
            </div>
          </LoaderProvider>
        </LenisProvider>
      </body>
    </html>
  );
}

