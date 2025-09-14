"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavTabs = () => {
  const pathname = usePathname();

  const baseTabClasses = "flex-1 text-center py-4 px-6 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden glass-effect hover:bg-accent-purple/20 hover:border-accent-purple hover:-translate-y-0.5";
  const activeTabClasses = "bg-gradient-to-br from-primary-purple to-secondary-purple border-accent-purple shadow-lg shadow-shadow-primary";

  return (
    <nav className="flex justify-center gap-4 mb-10 flex-wrap">
      <Link
        href="/text-to-image"
        className={`${baseTabClasses} ${pathname === "/text-to-image" ? activeTabClasses : ""}`}
      >
        🎨 Text to Image
      </Link>
      <Link
        href="/web-scraping"
        className={`${baseTabClasses} ${pathname === "/web-scraping" ? activeTabClasses : ""}`}
      >
        🔍 Web-Scrap Images
      </Link>
      <Link
        href="/text-to-speech"
        className={`${baseTabClasses} ${pathname === "/text-to-speech" ? activeTabClasses : ""}`}
      >
        🔊 Text to Speech
      </Link>
      <Link
        href="/more-tools"
        className={`${baseTabClasses} ${pathname === "/more-tools" ? activeTabClasses : ""}`}
      >
        🛠️ More Tools
      </Link>
    </nav>
  );
};

export default NavTabs;

