import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Book, Code, Youtube, Github } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-(--color-primary) to-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-(--color-primary)/20">
            <Play className="text-white fill-current translate-x-0.5" size={16} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">VoltNexis <span className="text-(--color-primary)">Player</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link to="/docs" className="hover:text-white transition-colors flex items-center gap-2"><Book size={16} /> Docs</Link>
          <Link to="/editor" className="hover:text-white transition-colors flex items-center gap-2"><Code size={16} /> Editor</Link>
          <Link to="/tutorials" className="hover:text-white transition-colors flex items-center gap-2"><Youtube size={16} /> Tutorials</Link>
          <a href="https://github.com/voltnexis/player" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            <Github size={16} /> GitHub
          </a>
        </div>

        <Link to="/editor" className="bg-(--color-primary) hover:bg-opacity-80 text-black px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-(--color-primary)/30">
          Get Started
        </Link>
      </div>
    </nav>
  );
};
