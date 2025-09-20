"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: 'ðŸ”Š', title: 'Text to Speech', desc: 'Natural voice synthesis' },
    { icon: 'ðŸŽ¨', title: 'Image Generator', desc: 'AI-powered creativity' },
    { icon: 'ðŸ–¼ï¸', title: 'Image Analysis', desc: 'Smart visual insights' },
    { icon: 'ðŸ› ï¸', title: '20+ Tools', desc: 'Complete AI toolkit' }
  ];

  const tools = [
    {
      href: '/text-to-speech',
      icon: 'ðŸ”Š',
      title: 'Text to Speech',
      description: 'Convert text into natural-sounding speech with multiple voices and languages.',
      gradient: 'from-blue-500 to-purple-600',
      features: ['Multiple Voices', 'High Quality', 'Fast Generation', 'MP3 Download']
    },
    {
      href: '/text-to-image',
      icon: 'ðŸŽ¨',
      title: 'AI Image Generator',
      description: 'Create stunning images from text descriptions using advanced AI models.',
      gradient: 'from-purple-500 to-pink-600',
      features: ['Multiple Styles', 'High Resolution', 'Creative Freedom', 'Instant Results']
    },
    {
      href: '/image-analysis',
      icon: 'ðŸ–¼ï¸',
      title: 'Image Analysis',
      description: 'Analyze and understand images with detailed AI-powered descriptions.',
      gradient: 'from-green-500 to-teal-600',
      features: ['Smart Analysis', 'Detailed Insights', 'Object Detection', 'Text Extraction']
    },
    {
      href: '/calculator',
      icon: 'ðŸ”¢',
      title: 'Smart Calculator',
      description: 'Advanced calculator with scientific functions and equation solving.',
      gradient: 'from-orange-500 to-red-600',
      features: ['Scientific Mode', 'History', 'Graphing', 'Unit Conversion']
    },
    {
      href: '/qr-generator',
      icon: 'ðŸ“±',
      title: 'QR Generator',
      description: 'Generate customizable QR codes for URLs, text, and contact information.',
      gradient: 'from-indigo-500 to-blue-600',
      features: ['Custom Design', 'Multiple Formats', 'High Quality', 'Bulk Generation']
    },
    {
      href: '/more-tools',
      icon: 'âš¡',
      title: 'More Tools',
      description: 'Explore our complete collection of 20+ AI-powered utilities and tools.',
      gradient: 'from-yellow-500 to-orange-600',
      features: ['20+ Tools', 'Regular Updates', 'All Free', 'No Sign-up']
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-8 animate-fade-in">
              <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              <span className="text-sm font-medium text-gray-300">
                All tools are free â€¢ No sign-up required
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 animate-slide-up">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Free AI Tools
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                For Everyone
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Transform your ideas with our suite of powerful AI tools. Generate speech, create images, analyze content, and much more â€” all completely free.
            </p>

            {/* Feature Carousel */}
            <div className="flex items-center justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="glass rounded-2xl p-6 max-w-md">
                <div className="text-4xl mb-3 animate-bounce">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {features[currentFeature].title}
                </h3>
                <p className="text-sm text-gray-400">
                  {features[currentFeature].desc}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Link
                href="/text-to-speech"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-xl font-semibold text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/more-tools"
                className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/10 transition-all duration-300 min-w-[200px]"
              >
                Explore All Tools
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful AI Tools
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose from our comprehensive collection of AI-powered tools designed to boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group block animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card card-interactive h-full">
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Try it now</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="animate-count-up">
                <div className="text-4xl font-bold text-primary mb-2">500K+</div>
                <div className="text-gray-400">Tools Used</div>
              </div>
              <div className="animate-count-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-accent mb-2">20+</div>
                <div className="text-gray-400">AI Tools</div>
              </div>
              <div className="animate-count-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-400">Free Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}