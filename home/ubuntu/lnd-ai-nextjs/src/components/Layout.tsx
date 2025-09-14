import Link from "next/link";
import Chatbot from "./Chatbot";
import Particles from "./Particles";
import NavTabs from "./NavTabs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Particles />
      <div className="relative z-20 max-w-7xl mx-auto px-4 min-h-screen flex flex-col">
        <header className="text-center py-12 px-8 mb-10 bg-glass-bg backdrop-blur-xl border-2 border-glass-border rounded-3xl shadow-primary-lg relative overflow-hidden header-glow">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-6 mb-6">
              <Link
                href="/"
                className="flex items-center gap-6 no-underline"
              >
                {/* SVG logo */}
                <svg
                  className="w-24 h-24 logo-shadow"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="logoGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#2D1B69" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="20" cy="30" r="5" fill="url(#logoGradient)" />
                  <circle cx="50" cy="20" r="6" fill="url(#logoGradient)" />
                  <circle cx="80" cy="35" r="5" fill="url(#logoGradient)" />
                  <circle cx="30" cy="60" r="7" fill="url(#logoGradient)" />
                  <circle cx="70" cy="65" r="6" fill="url(#logoGradient)" />
                  <circle
                    cx="50"
                    cy="50"
                    r="10"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="4"
                  />
                  <text
                    x="50"
                    y="56"
                    textAnchor="middle"
                    fill="url(#logoGradient)"
                    fontFamily="Orbitron"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    AI
                  </text>
                </svg>
                <div>
                  <h1 className="font-orbitron text-5xl font-extrabold bg-gradient-to-r from-text-light via-accent-purple to-light-purple bg-300% animate-textGradient text-transparent bg-clip-text shadow-text-glow mb-4 tracking-wide">
                    LND Ai | Free Text to Image generator
                  </h1>
                  <p className="text-text-accent text-lg opacity-90 font-normal tracking-wide shadow-text-sm">
                    ◆ Free Ai Tools | Free Text To Image Generator ◆
                  </p>
                </div>
              </Link>
            </div>
            <div className="absolute top-6 right-6 bg-gradient-to-br from-primary-purple to-secondary-purple py-2 px-4 rounded-full text-sm font-bold tracking-wide shadow-primary-md border border-glass-border badge-pulse">
              Created by Naman
            </div>
          </div>
        </header>

        {/* Navigation (client component) */}
        <NavTabs />

        <main className="flex-1 grid grid-cols-1 gap-8 max-w-3xl mx-auto w-full">{children}</main>

        <footer className="mt-10 py-6 text-center text-text-muted text-sm">
          <p>
            Powered by <span className="font-bold text-light-purple">LND</span> • Free Ai
            Tools
          </p>
        </footer>
      </div>

      <Chatbot />
    </>
  );
};

export default Layout;

