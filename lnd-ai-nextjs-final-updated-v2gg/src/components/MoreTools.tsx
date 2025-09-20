"use client";
import Link from 'next/link';
import { useState } from 'react';

const MoreTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tools', icon: 'ðŸ”¥' },
    { id: 'ai', name: 'AI Tools', icon: 'ðŸ¤–' },
    { id: 'utility', name: 'Utilities', icon: 'ðŸ› ï¸' },
    { id: 'media', name: 'Media', icon: 'ðŸŽµ' },
    { id: 'developer', name: 'Developer', icon: 'ðŸ‘©â€ðŸ’»' },
    { id: 'fun', name: 'Fun & Games', icon: 'ðŸŽ®' }
  ];

  const tools = [
    {
      href: '/text-to-speech',
      icon: 'ðŸ”Š',
      title: 'Text to Speech',
      description: 'Convert text into natural-sounding speech with multiple voices',
      category: 'ai',
      featured: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      href: '/text-to-image',
      icon: 'ðŸŽ¨',
      title: 'AI Image Generator',
      description: 'Create stunning images from text descriptions',
      category: 'ai',
      featured: true,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      href: '/image-analysis',
      icon: 'ðŸ–¼ï¸',
      title: 'Image Analysis',
      description: 'Analyze images with AI-powered descriptions',
      category: 'ai',
      featured: true,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      href: '/calculator',
      icon: 'ðŸ”¢',
      title: 'Smart Calculator',
      description: 'Advanced calculator with scientific functions',
      category: 'utility',
      featured: false,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      href: '/qr-generator',
      icon: 'ðŸ“±',
      title: 'QR Code Generator',
      description: 'Generate customizable QR codes instantly',
      category: 'utility',
      featured: false,
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      href: '/password-generator',
      icon: 'ðŸ”',
      title: 'Password Generator',
      description: 'Create secure passwords with custom options',
      category: 'utility',
      featured: false,
      gradient: 'from-red-500 to-pink-600'
    },
    {
      href: '/color-converter',
      icon: 'ðŸŒˆ',
      title: 'Color Converter',
      description: 'Convert between color formats (HEX, RGB, HSL)',
      category: 'developer',
      featured: false,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      href: '/binary-converter',
      icon: '01',
      title: 'Binary Converter',
      description: 'Convert between binary, decimal, and hex',
      category: 'developer',
      featured: false,
      gradient: 'from-gray-500 to-blue-600'
    },
    {
      href: '/hash-converter',
      icon: '#',
      title: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256 hashes',
      category: 'developer',
      featured: false,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      href: '/image-editor',
      icon: 'âœ‚ï¸',
      title: 'Image Editor',
      description: 'Edit images with filters and effects',
      category: 'media',
      featured: false,
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      href: '/image-resize',
      icon: 'ðŸ“',
      title: 'Image Resizer',
      description: 'Resize images while maintaining quality',
      category: 'media',
      featured: false,
      gradient: 'from-teal-500 to-green-600'
    },
    {
      href: '/image-converter',
      icon: 'ðŸ”„',
      title: 'Image Converter',
      description: 'Convert images between different formats',
      category: 'media',
      featured: false,
      gradient: 'from-blue-500 to-teal-600'
    },
    {
      href: '/audio-recorder',
      icon: 'ðŸŽ¤',
      title: 'Audio Recorder',
      description: 'Record and download audio directly in your browser',
      category: 'media',
      featured: false,
      gradient: 'from-red-500 to-orange-600'
    },
    {
      href: '/notes',
      icon: 'ðŸ“',
      title: 'Smart Notes',
      description: 'Take notes with rich text formatting',
      category: 'utility',
      featured: false,
      gradient: 'from-green-500 to-blue-600'
    },
    {
      href: '/weather',
      icon: 'ðŸŒ¤ï¸',
      title: 'Weather Check',
      description: 'Get current weather information',
      category: 'utility',
      featured: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      href: '/ip-detector',
      icon: 'ðŸŒ',
      title: 'IP Detector',
      description: 'Detect your IP address and location info',
      category: 'utility',
      featured: false,
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      href: '/net-speed',
      icon: 'âš¡',
      title: 'Speed Test',
      description: 'Test your internet connection speed',
      category: 'utility',
      featured: false,
      gradient: 'from-yellow-500 to-red-600'
    },
    {
      href: '/code-scanner',
      icon: 'ðŸ“·',
      title: 'QR Scanner',
      description: 'Scan QR codes and barcodes with your camera',
      category: 'utility',
      featured: false,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      href: '/whiteboard',
      icon: 'âœï¸',
      title: 'Digital Whiteboard',
      description: 'Collaborative drawing and sketching tool',
      category: 'utility',
      featured: false,
      gradient: 'from-orange-500 to-pink-600'
    },
    {
      href: '/coin-toss',
      icon: 'ðŸª™',
      title: 'Coin Toss',
      description: 'Virtual coin flip with animations',
      category: 'fun',
      featured: false,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      href: '/advanced-clock',
      icon: 'â°',
      title: 'World Clock',
      description: 'Advanced clock with multiple timezones',
      category: 'utility',
      featured: false,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      href: '/tone-generator',
      icon: 'ðŸŽµ',
      title: 'Tone Generator',
      description: 'Generate audio tones and frequencies',
      category: 'media',
      featured: false,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      href: '/html-viewer',
      icon: 'ðŸ’»',
      title: 'HTML Viewer',
      description: 'Preview and test HTML code',
      category: 'developer',
      featured: false,
      gradient: 'from-red-500 to-pink-600'
    },
    {
      href: '/web-scraping',
      icon: 'ðŸ”',
      title: 'Web Scraper',
      description: 'Extract data from web pages',
      category: 'developer',
      featured: false,
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTools = tools.filter(tool => tool.featured);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ðŸ› ï¸ All AI Tools
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our complete collection of 20+ free AI-powered tools designed to boost your productivity and creativity.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-12 w-full"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tools */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">â­ Featured Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group block"
                >
                  <div className="card card-interactive h-full">
                    <div className="relative p-8">
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      </div>
                      
                      <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                        {tool.title}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Try now</span>
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
        )}

        {/* All Tools Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {searchQuery ? `Search Results (${filteredTools.length})` : 
             selectedCategory === 'all' ? 'All Tools' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card card-interactive h-full">
                    <div className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                        <span>Open Tool</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">ðŸ”</div>
              <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn-primary"
              >
                Show All Tools
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Why Choose LND AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl mb-2">ðŸ†“</div>
                <div className="font-semibold text-white">100% Free</div>
                <div className="text-sm text-gray-400">No hidden costs</div>
              </div>
              <div>
                <div className="text-3xl mb-2">ðŸš€</div>
                <div className="font-semibold text-white">No Sign-up</div>
                <div className="text-sm text-gray-400">Start immediately</div>
              </div>
              <div>
                <div className="text-3xl mb-2">ðŸ”’</div>
                <div className="font-semibold text-white">Privacy First</div>
                <div className="text-sm text-gray-400">Data stays local</div>
              </div>
              <div>
                <div className="text-3xl mb-2">âš¡</div>
                <div className="font-semibold text-white">Lightning Fast</div>
                <div className="text-sm text-gray-400">Optimized performance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreTools;