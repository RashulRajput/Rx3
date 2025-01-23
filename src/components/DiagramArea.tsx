import React from 'react';

export default function DiagramArea() {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-purple-500/5 rounded-xl blur-xl transform group-hover:scale-105 transition-transform duration-300"></div>
      <div className="relative bg-gray-900/50 rounded-xl p-4 h-[600px] backdrop-blur-sm border border-purple-500/20">
        <iframe
          src="https://app.diagrams.net/?embed=1&ui=dark&spin=1&proto=json"
          className="w-full h-full rounded-lg transform transition-transform duration-300 group-hover:scale-[1.01]"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}