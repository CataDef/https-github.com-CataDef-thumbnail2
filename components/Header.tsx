
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12 text-center">
      <div className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-blue-400 uppercase border border-blue-500/30 rounded-full bg-blue-500/10">
        Future Design Protocol
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
        VIRAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">2026</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
        The advanced thumbnail engine that predicts click psychology, ignores clichés, and crafts authority-driven visuals.
      </p>
    </header>
  );
};

export default Header;
