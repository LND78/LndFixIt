import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import Script from "next/script";

const structuredData1 = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LND Ai",
  "url": "https://www.namansoni.in/",
  "description": "LND Ai, unlimited text to image Generator, All-in-one AI-powered tools. Text-to-image, TTS, QR code Generator, and 20+ browser tools.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "160000"
  }
};

export const metadata: Metadata = {
  title: "LND Ai | Free Text to Image generator | Free AI Tools | Image generator",
  description: "LND Ai | Free Text to image generator – 20+ free AI-powered tools. Generate Images | Generate Qr Code. No sign-up needed. Made by Naman",
  authors: [{ name: 'Naman Soni' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://namansoni.in/',
    title: 'LND Ai | Free Text To Image Generator | Free AI Tools No login Required',
    description: 'LND Ai , Free unlimited text to image Generator |  Discover 20+ free AI & creative tools by Naman Soni – AI art, TTS, notes, utilities & developer tools. No login required.',
    images: [{ url: 'https://namansoni.in/og-preview.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naman Soni | LND Multi-Tool Suite | Free AI Tools',
    description: 'Free AI & creative tools by Naman Soni. Generate art, speech & use 20+ utilities online.',
    images: ['https://namansoni.in/og-preview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.namansoni.in/" />
        <meta name="google-site-verification" content="d13Hh8m2coFjR-lHc63J8TJZSHc95Q5bJAxervsJEtk" />
        <Script id="structured-data-1" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(structuredData1)}
        </Script>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
