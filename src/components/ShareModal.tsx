import React, { useRef, useEffect } from 'react';
import { X, Copy, Check, Twitter, Facebook, MessageCircle, Share2 } from 'lucide-react';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const shareOptions = [
    { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2]', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-[#4267B2]', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]', href: `https://wa.me/?text=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-(--color-primary) rounded-lg bg-opacity-10 text-(--color-primary)">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Share Video</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`${option.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <option.icon size={24} />
              </div>
              <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">{option.name}</span>
            </a>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Copy Link</label>
          <div className="relative group">
            <input 
              readOnly 
              value={url}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-zinc-300 focus:outline-none group-focus-within:border-(--color-primary)/30 transition-all font-mono"
            />
            <button 
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
