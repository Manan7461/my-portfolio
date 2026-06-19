import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
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
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('loader-active');
            `,
          }}
        />
      </head>
      <body
        className={`${jetbrains.variable} antialiased`}
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

