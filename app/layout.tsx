import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "PC Games Catalogue",
  description: "A small catalogue of PC games from the last ten years.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="pcg">
          <SiteNav />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
