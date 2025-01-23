import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-lg border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-sm font-semibold text-purple-400 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-gray-300">
              ResearchX helps researchers organize their work, create diagrams, and discover papers with royal elegance.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-400 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {['Documentation', 'API', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-400 tracking-wider uppercase">Connect</h3>
            <div className="mt-4 flex space-x-6">
              <a
                href="https://instagram.com/rashulrajput"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transform hover:scale-110 transition-all duration-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
              {[Github, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transform hover:scale-110 transition-all duration-300"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-purple-500/20 pt-8">
          <p className="text-center text-gray-400">&copy; 2024 ResearchX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}