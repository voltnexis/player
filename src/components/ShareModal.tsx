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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className="w-full max-w-sm bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] p-8 animate-in zoom-in-95 duration-300"
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
              <div className={`${option.color} p-4 rounded-3xl text-white shadow-xl group-hover:scale-110 active:scale-95 transition-all duration-300`}>
                <option.icon size={26} />
              </div>
              <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-white transition-colors">{option.name}</span>
            </a>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Copy Link</label>
          <div className="relative group">
            <input 
              readOnly 
              value={url}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 pr-12 text-[13px] text-zinc-300 focus:outline-none group-focus-within:border-(--color-primary)/40 transition-all font-mono tracking-tight"
            />
            <button 
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
