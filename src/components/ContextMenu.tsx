import React, { useEffect, useRef } from 'react';
import { ExternalLink, Copy, HelpCircle } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  copyUrl: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, copyUrl }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl py-1 min-w-[220px] animate-in fade-in zoom-in duration-150"
      style={{ top: y, left: x }}
    >
      <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">
        VoltNexis Player v1.0
      </div>
      
      <button 
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        disabled
      >
        <span className="font-medium italic opacity-70">Powered by VoltNexis</span>
      </button>

      <a 
        href="https://vnplayer.vercel.js" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        onClick={onClose}
      >
        <span>Open VN Player</span>
        <ExternalLink size={14} className="opacity-50" />
      </a>

      <a 
        href="https://voltnexis.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        onClick={onClose}
      >
        <span>Open VoltNexis</span>
        <ExternalLink size={14} className="opacity-50" />
      </a>

      <div className="h-px bg-white/5 my-1" />

      <button 
        onClick={() => { copyUrl(); onClose(); }}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        <span>Copy page URL</span>
        <Copy size={14} className="opacity-50" />
      </button>
    </div>
  );
};
