"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AdvancedParticles from "./Particles";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: 'ðŸ ' },
    { name: 'Text to Speech', href: '/text-to-speech', icon: 'ðŸ”Š' },
    { name: 'Text to Image', href: '/text-to-image', icon: 'ðŸŽ¨' },
    { name: 'Image Analysis', href: '/image-analysis', icon: 'ðŸ–¼ï¸' },
    { name: 'More Tools', href: '/more-tools', icon: 'ðŸ› ï¸' },
  ];

  return (
    <>
      <AdvancedParticles />
      <div className="min-h-screen relative z-10">
        {/* Modern Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
        }`}>
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    LND AI
                  </h1>
                  <p className="text-xs text-gray-400 -mt-1">Free AI Tools</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                  <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-0.5' : ''
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-white mt-1 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-white mt-1 transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''
                  }`}></span>
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="py-4 space-y-2 border-t border-white/10 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-3"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-16 lg:pt-20">
          {children}
        </main>

        {/* Modern Footer */}
        <footer className="relative mt-20 border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <h3 className="text-xl font-bold text-white">LND AI</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Your all-in-one suite of free AI-powered tools. Generate, create, and optimize with cutting-edge AI technology.
              </p>
              <div className="flex items-center justify-center space-x-6 mb-8">
                <Link href="/text-to-speech" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Text to Speech
                </Link>
                <Link href="/text-to-image" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Image Generator
                </Link>
                <Link href="/more-tools" className="text-gray-400 hover:text-white transition-colors duration-300">
                  More Tools
                </Link>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  Â© 2024 LND AI by Naman Soni. All rights reserved. Made with â¤ï¸ for the community.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;