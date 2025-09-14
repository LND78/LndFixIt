/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-purple": "#1A0F3A",
        "secondary-purple": "#2C105A",
        "dark-purple": "#120B2E",
        "light-purple": "#6366F1",
        "accent-purple": "#8B5CF6",
        "bg-black": "#000000",
        "bg-dark": "#0A0A1A",
        "bg-darker": "#05050D",
        "text-light": "#F8FAFC",
        "text-accent": "#E2E8F0",
        "text-muted": "#94A3B8",
        "glass-bg": "rgba(45, 27, 105, 0.15)",
        "glass-border": "rgba(139, 92, 246, 0.3)",
        "shadow-primary": "rgba(45, 27, 105, 0.4)",
        "shadow-accent": "rgba(139, 92, 246, 0.2)",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        "primary-lg": "0 25px 50px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.1)",
        "primary-md": "0 8px 20px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-card": "0 20px 40px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
      animation: {
        gradientShift: "gradientShift 20s ease infinite",
        backgroundPulse: "backgroundPulse 15s ease-in-out infinite",
        headerGlow: "headerGlow 3s ease-in-out infinite alternate",
        rotate: "rotate 12s linear infinite",
        logoFloat: "logoFloat 4s ease-in-out infinite",
        textGradient: "textGradient 4s ease-in-out infinite",
        badgePulse: "badgePulse 2s ease-in-out infinite",
        panelGlow: "panelGlow 4s ease-in-out infinite alternate",
        borderGlow: "borderGlow 3s ease-in-out infinite",
        arrowFloat: "arrowFloat 2s ease-in-out infinite",
        buttonPulse: "buttonPulse 3s ease-in-out infinite",
        buttonHover: "buttonHover 1s ease infinite",
        iconSpin: "iconSpin 2s linear infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "25%": { "background-position": "100% 50%" },
          "50%": { "background-position": "100% 100%" },
          "75%": { "background-position": "0% 100%" },
        },
        backgroundPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        headerGlow: {
          "0%": { "box-shadow": "0 25px 50px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(139, 92, 246, 0.1)" },
          "100%": { "box-shadow": "0 30px 60px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 2px rgba(139, 92, 246, 0.2)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        logoFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(5deg)" },
        },
        textGradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        badgePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        panelGlow: {
          "0%": { "box-shadow": "0 20px 40px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.1)" },
          "100%": { "box-shadow": "0 25px 50px var(--shadow-primary), inset 0 1px 0 rgba(255, 255, 255, 0.15)" },
        },
        borderGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        arrowFloat: {
          "0%, 100%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(-45%)" },
        },
        buttonPulse: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        buttonHover: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        iconSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

