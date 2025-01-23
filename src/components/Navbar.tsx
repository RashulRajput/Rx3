import React from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const whatsappGroupLink = "https://chat.whatsapp.com/BAkVeo0eNh89dtACBRwAlQ";

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Contact', href: whatsappGroupLink, external: true }
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-3 group">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-purple-400 transform transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                ResearchX
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-300 hover:text-purple-400 transition-colors duration-300 relative group ${
                    location.pathname === item.href ? 'text-purple-400' : ''
                  }`}
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              )
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-purple-400 focus:outline-none transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-purple-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300 ${
                    location.pathname === item.href ? 'text-purple-400 bg-purple-500/10' : ''
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}