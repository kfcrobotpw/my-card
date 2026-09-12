import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  url: string;
  iconType?: 'youtube' | 'portfolio' | 'default';
  lang?: Language;
}

export default function QrCodeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  url,
  iconType = 'default',
  lang = 'ko',
}: QrCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-sm rounded-3xl bg-[#081224] p-6 relative overflow-hidden text-center text-slate-100 shadow-2xl ${
          iconType === 'youtube'
            ? 'border-2 border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.35)]'
            : 'border-2 border-teal-400/80 shadow-[0_0_60px_rgba(0,229,192,0.35)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic background sheen */}
        <div className="absolute inset-0 holographic-sheen pointer-events-none opacity-25" />
        <div className="hud-scanner" />

        {/* Top close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer z-20"
          title={t.close + " (Esc)"}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5 text-[11px] font-mono-code font-bold tracking-widest uppercase">
          {iconType === 'youtube' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-red-500 -ml-3.5" />
              <span className="text-red-400">{t.youtubeQrPass}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#00e5c0] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#00e5c0] -ml-3.5" />
              <span className="text-teal-300">{t.portfolioQrPass}</span>
            </>
          )}
        </div>

        {/* Title & Icon */}
        <div className="flex items-center justify-center gap-2 mb-1">
          {iconType === 'youtube' && (
            <div className="w-8 h-8 rounded-xl bg-red-600/30 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
          )}
          {iconType === 'portfolio' && (
            <div className="w-8 h-8 rounded-xl bg-teal-500/25 flex items-center justify-center text-teal-300 font-tech font-bold text-sm shrink-0 shadow-sm">
              &lt;/&gt;
            </div>
          )}
          <h3 id="qr-modal-title" className="text-xl font-bold text-white tracking-tight">
            {title}
          </h3>
        </div>

        {subtitle && (
          <p className="text-xs text-slate-300 font-mono-code mb-3">
            {subtitle}
          </p>
        )}

        {/* High-Contrast Large QR Code Container with Corner HUD brackets */}
        <div className="relative my-3 inline-flex items-center justify-center p-3 sm:p-4 bg-white qr-contrast-box rounded-2xl shadow-2xl border-2 border-slate-200">
          <span className={`absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 rounded-tl pointer-events-none ${iconType === 'youtube' ? 'border-red-500' : 'border-teal-400'}`} />
          <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 rounded-tr pointer-events-none ${iconType === 'youtube' ? 'border-red-500' : 'border-teal-400'}`} />
          <span className={`absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 rounded-bl pointer-events-none ${iconType === 'youtube' ? 'border-red-500' : 'border-teal-400'}`} />
          <span className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 rounded-br pointer-events-none ${iconType === 'youtube' ? 'border-red-500' : 'border-teal-400'}`} />

          <QRCodeSVG
            value={url}
            size={210}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
            includeMargin={true}
            style={{ shapeRendering: 'crispEdges' }}
          />
        </div>

        {/* Scan instruction */}
        <div className={`text-xs font-mono-code tracking-wide mb-3 flex items-center justify-center gap-1.5 font-bold ${
          iconType === 'youtube' ? 'text-red-400' : 'text-teal-300'
        }`}>
          <QrCode className="w-3.5 h-3.5" />
          <span>{t.scanWithCamera}</span>
        </div>

        {/* URL Box & Copy */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 mb-4">
          <span className="text-[11px] font-mono-code text-slate-300 truncate flex-1 text-left px-1 select-all">
            {url}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono-code transition font-bold ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs font-mono-code transition flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
              iconType === 'youtube'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-400/25'
            }`}
          >
            <span>{t.openInNewTab}</span>
            <span>↗</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono-code transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

