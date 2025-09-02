import "./globals.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

import { Montserrat_Alternates, Geist_Mono } from "next/font/google";

const montAlt = Montserrat_Alternates({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",      
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",     
  display: "swap",
});

export const metadata = { title: "App", description: "…" };

export default function RootLayout({ children }) {
  return (
    <html lang="uk" className={`${montAlt.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
