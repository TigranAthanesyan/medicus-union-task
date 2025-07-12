import type { Metadata } from "next";
import Providers from "../components/Providers";
import Layout from "../components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medicus Union Task",
  description: "Consultation Booking & Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
