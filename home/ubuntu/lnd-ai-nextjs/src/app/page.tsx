import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="control-panel glass-effect panel-glow p-8 md:p-12 rounded-3xl w-full max-w-4xl mx-auto border-glass-border relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-center text-3xl md:text-4xl font-bold text-text-light mb-6 font-orbitron text-gradient">
        ◆ Welcome to LND Ai ◆
      </h2>
      <p className="text-center text-text-accent text-lg mb-10 max-w-2xl mx-auto">
        Your all-in-one suite of free AI-powered tools. Select a tool below to get started.
      </p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={cardVariants}>
          <Link href="/text-to-image" className="tool-card glass-effect p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-accent-purple hover:shadow-lg">
            <span className="tool-icon text-5xl mb-4">🎨</span>
            <h3 className="tool-title text-xl font-semibold text-text-light mb-2">Text to Image</h3>
            <p className="tool-description text-text-muted text-sm">Bring your imagination to life with our powerful AI image generator.</p>
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/web-scraping" className="tool-card glass-effect p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-accent-purple hover:shadow-lg">
            <span className="tool-icon text-5xl mb-4">🔍</span>
            <h3 className="tool-title text-xl font-semibold text-text-light mb-2">Web-Scrap Images</h3>
            <p className="tool-description text-text-muted text-sm">Find and download high-quality images from across the web.</p>
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/text-to-speech" className="tool-card glass-effect p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-accent-purple hover:shadow-lg">
            <span className="tool-icon text-5xl mb-4">🔊</span>
            <h3 className="tool-title text-xl font-semibold text-text-light mb-2">Text to Speech</h3>
            <p className="tool-description text-text-muted text-sm">Convert any text into natural-sounding speech with various voices.</p>
          </Link>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Link href="/more-tools" className="tool-card glass-effect p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-accent-purple hover:shadow-lg">
            <span className="tool-icon text-5xl mb-4">🛠️</span>
            <h3 className="tool-title text-xl font-semibold text-text-light mb-2">More Tools</h3>
            <p className="tool-description text-text-muted text-sm">Explore a collection of 10+ utility tools for everyday tasks.</p>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

