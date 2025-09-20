import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import Script from "next/script";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LND AI - Free AI Tools Suite",
  "url": "https://www.namansoni.in/",
  "description": "Professional suite of 20+ free AI-powered tools including text-to-speech, image generation, calculators, and utilities. No sign-up required.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires modern web browser with JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "25000",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "Naman Soni",
    "url": "https://namansoni.in"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-09-20",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "keywords": [
    "AI tools",
    "text to speech",
    "image generator", 
    "free AI",
    "online tools",
    "productivity tools",
    "artificial intelligence",
    "web utilities"
  ]
};

export const metadata: Metadata = {
  title: "LND AI - Free AI Tools Suite | 20+ Professional AI Tools by Naman Soni",
  description: "Professional suite of 20+ free AI-powered tools including advanced text-to-speech, AI image generation, smart calculator, QR generator, and more. No sign-up required, privacy-first design.",
  keywords: [
    "free AI tools",
    "text to speech generator", 
    "AI image generator",
    "online calculator",
    "QR code generator",
    "password generator",
    "web utilities",
    "productivity tools",
    "Naman Soni",
    "LND AI"
  ],
  authors: [{ name: 'Naman Soni', url: 'https://namansoni.in' }],
  creator: 'Naman Soni',
  publisher: 'LND AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  googlebot: 'index, follow',
  referrer: 'origin-when-cross-origin',
  themeColor: '#3b82f6',
  colorScheme: 'dark',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  category: 'technology',
  classification: 'AI Tools, Web Utilities, Productivity',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namansoni.in/',
    siteName: 'LND AI - Free AI Tools Suite',
    title: 'LND AI - 20+ Free AI Tools | Professional AI Suite by Naman Soni',
    description: 'Professional suite of free AI-powered tools: text-to-speech, image generation, calculators, and 20+ utilities. No sign-up required, privacy-first design.',
    images: [
      {
        url: 'https://namansoni.in/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'LND AI - Free AI Tools Suite',
        type: 'image/png',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@namansoni',
    creator: '@namansoni',
    title: 'LND AI - 20+ Free AI Tools | Professional AI Suite',
    description: 'Professional suite of free AI-powered tools: text-to-speech, image generation, calculators, and utilities. No sign-up required.',
    images: ['https://namansoni.in/og-preview.png'],
  },

  alternates: {
    canonical: 'https://www.namansoni.in/',
  },

  manifest: '/manifest.json',
  
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'LND AI Tools',
    'application-name': 'LND AI',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="canonical" href="https://www.namansoni.in/" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="google-site-verification" content="d13Hh8m2coFjR-lHc63J8TJZSHc95Q5bJAxervsJEtk" />
        <meta name="bing-site-verification" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <Script 
          id="structured-data" 
          type="application/ld+json" 
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}