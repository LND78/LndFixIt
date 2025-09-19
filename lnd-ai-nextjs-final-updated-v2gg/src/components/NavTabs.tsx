"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="nav-tabs">
      <Link
        href="/text-to-image"
        className={`nav-tab ${pathname === "/text-to-image" ? "active" : ""}`}
      >
        🎨 Text to Image
      </Link>
      <Link
        href="/text-to-speech"
        className={`nav-tab ${pathname === "/text-to-speech" ? "active" : ""}`}
      >
        🔊 Text to Speech
      </Link>
      <Link
        href="/image-analysis"
        className={`nav-tab ${pathname === "/image-analysis" ? "active" : ""}`}
      >
        🖼️ Image Analysis
      </Link>
      <Link
        href="/web-scraping"
        className={`nav-tab ${pathname === "/web-scraping" ? "active" : ""}`}
      >
        🔍 Web Scraping
      </Link>
      <Link
        href="/more-tools"
        className={`nav-tab ${pathname === "/more-tools" ? "active" : ""}`}
      >
        🛠️ More Tools
      </Link>
    </nav>
  );
};

export default NavTabs;
