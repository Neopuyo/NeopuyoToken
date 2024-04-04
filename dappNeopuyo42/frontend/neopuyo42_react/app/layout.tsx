import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./context/Providers";
import MainFrame from "./components/MainFrame";

export const metadata: Metadata = {
  title: "Neopuyo 42",
  description: "A dapp using a token deployed on bsc testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen dark:bg-slate-900 antialiased">
        <Providers>
          <MainFrame >
            {children}
          </MainFrame>
        </Providers>
      </body>
    </html>
  );
}



