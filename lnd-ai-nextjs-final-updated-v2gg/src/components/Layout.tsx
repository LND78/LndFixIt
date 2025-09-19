import Link from "next/link";
import Chatbot from "./Chatbot";
import Particles from "./Particles";
import NavTabs from "./NavTabs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Particles />
      <div className="container">
        <header className="header fade-in">
          <div className="header-content">
            <div className="logo-container">
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "25px",
                }}
              >
                {/* SVG logo */}
                <svg
                  className="logo-svg"
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
                      <stop offset="0%" style={{ stopColor: "#8B5CF6" }} />
                      <stop offset="50%" style={{ stopColor: "#6366F1" }} />
                      <stop offset="100%" style={{ stopColor: "#2D1B69" }} />
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
                  <h1 className="main-title">
                    LND Ai | Free Text to Image generator
                  </h1>
                  <p className="subtitle">
                    ◆ Free Ai Tools | Free Text To Image Generator ◆
                  </p>
                </div>
              </Link>
            </div>
            <div className="credit-badge">Created by Naman</div>
          </div>
        </header>

        {/* Navigation (client component) */}
        <NavTabs />

        <main className="main-content">{children}</main>

        <footer className="footer">
          <p className="footer-text">
            Powered by <span className="lnd-signature">LND</span> • Free Ai
            Tools
          </p>
        </footer>
      </div>

      <Chatbot />
    </>
  );
};

export default Layout;
