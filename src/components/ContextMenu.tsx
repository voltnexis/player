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
      className="fixed z-50 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-2 min-w-[240px] animate-in fade-in zoom-in duration-200"
      style={{ top: y, left: x }}
    >
      <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">
        VoltNexis Player v2.7
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
