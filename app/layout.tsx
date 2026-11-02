import type { Metadata } from "next";
import { Roboto, Poppins, Raleway } from "next/font/google";
import { SiteDataProvider } from "@/context/SiteDataContext";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const raleway = Raleway({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://template6-portofolio.web.app"),
  title: "Brandon Johnson - Portfolio | Next.js 15 & React 19",
  description: "Personal portfolio website built with Next.js 15, React 19, TypeScript 5, and Tailwind CSS v4",
  icons: {
    icon: [
      { url: "/assets/img/olifyhub.png" },
      { url: "/icon.png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/assets/img/olifyhub.png" },
    ],
    shortcut: "/assets/img/olifyhub.png",
  },
  openGraph: {
    title: "Brandon Johnson - Portfolio | Next.js 15 & React 19",
    description: "Personal portfolio website built with Next.js 15, React 19, TypeScript 5, and Tailwind CSS v4",
    url: "/",
    siteName: "Brandon Johnson Portfolio",
    images: [
      {
        url: "/assets/img/olifyhub.png",
        width: 180,
        height: 180,
        alt: "Olifyhub Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Brandon Johnson - Portfolio | Next.js 15 & React 19",
    description: "Personal portfolio website built with Next.js 15, React 19, TypeScript 5, and Tailwind CSS v4",
    images: ["/assets/img/olifyhub.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable} ${raleway.variable}`}>
      <body className="antialiased text-[#272829] bg-white selection:bg-[#0563bb] selection:text-white">
        <SiteDataProvider>{children}</SiteDataProvider>
      </body>
    </html>
  );
}
