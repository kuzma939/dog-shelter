import "./globals.css";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Providers } from "../redux/Providers.jsx";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import DevScrollFix from "./DevScrollFix"; 
const montserrat = Montserrat({
  variable: "--font-sans",              
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const montAlt = Montserrat_Alternates({
  variable: "--font-alt",               
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata = { title: "App", description: "…" };

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body
      className={`${montserrat.variable} ${montAlt.variable} antialiased`}
       
      >
          <DevScrollFix />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
