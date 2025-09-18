import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, DM_Sans, Poppins, Lexend_Deca } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });
const lexendDeca = Lexend_Deca({ variable: "--font-lexend-deca", subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Minesweeper",
  description: "Minesweepers of the Midwest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={[
          // Choose ONE primary text face to be your default; keep others available as CSS vars
          "font-sans antialiased ",
          inter.variable,             // default text face
          geistSans.variable,         // optional heading face
          geistMono.variable,         // optional mono
          dmSans.variable,            // available if you switch in CSS
          poppins.variable,
          lexendDeca.variable,
        ].join(" ")}
      >
          {children}
      </body>
    </html>
  );
}
