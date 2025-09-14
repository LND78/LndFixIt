import HashConverter from "@/components/HashConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Converter & Encryption Tool | LND AI",
  description:
    "Generate SHA-1, SHA-256, SHA-512, and PBKDF2 hashes for free. Secure your data with our online hashing tool.",
  keywords: [
    "Hash Converter",
    "Encryption",
    "SHA1 Generator",
    "SHA256 Generator",
    "SHA512 Generator",
    "PBKDF2 Generator",
    "LND AI",
  ],
};

export default function HashConverterPage() {
  return <HashConverter />;
}
