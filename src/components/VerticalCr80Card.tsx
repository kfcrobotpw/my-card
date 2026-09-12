import { useState } from 'react';
import { QrCode, Maximize2 } from 'lucide-react';
import CrispQrCode from './CrispQrCode';
import { Language, StudentData } from '../types';
import { translations } from '../translations';
import QrCodeModal from './QrCodeModal';

interface VerticalCr80CardProps {
  student: StudentData;
  isFlipped: boolean;
  onFlip: () => void;
  showFallback?: boolean;
  onAdminTrigger?: () => void;
  isAdminLoggedIn?: boolean;
  lang?: Language;
  onOpenQrModal?: (data: {
    isOpen: boolean;
    title: string;
    subtitle?: string;
    url: string;
    iconType?: 'youtube' | 'portfolio' | 'default';
  }) => void;
}

export default function VerticalCr80Card({
  student,
  isFlipped,
  onFlip,
  showFallback,
  onAdminTrigger,
  isAdminLoggedIn,
  lang = 'ko',
  onOpenQrModal,
}: VerticalCr80CardProps) {
  const [selectedChannel, setSelectedChannel] = useState<'youtube' | 'portfolio'>('youtube');
  const t = translations[lang];

  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    url: string;
    iconType: 'youtube' | 'portfolio' | 'default';
  } | null>(null);

  const openChannelQr = (channel: 'youtube' | 'portfolio') => {
    setSelectedChannel(channel);
    const targetUrl = channel === 'youtube' ? student.links.youtube : student.links.portfolio;
    if (!targetUrl) return;

    const modalData = {
      isOpen: true,
      title: channel === 'youtube' ? t.youtubeTitle : t.portfolioTitle,
      subtitle: channel === 'youtube' ? t.youtubeSubtitle : targetUrl.replace('https://', ''),
      url: targetUrl,
      iconType: channel,
    };

    if (onOpenQrModal) {
      onOpenQrModal(modalData);
    } else {
      setQrModal(modalData);
    }
  };

  // Active target calculation: prioritize user-selected channel
  const activeQrTarget = showFallback
    ? null
    : (selectedChannel === 'youtube' && student.links.youtube
        ? student.links.youtube
        : (student.links.portfolio || student.qrTarget || student.links.youtube));

  const activeQrLabel = showFallback
    ? t.noUrl
    : (selectedChannel === 'youtube' && student.links.youtube
        ? t.youtubeTitle
        : t.portfolioTitle);

  return (
    <div className="w-full max-w-[360px] sm:max-w-[370px] flex flex-col items-center select-none">
      {/* 3D Physical Card */}
      <div
        id="cr80-card-container"
        className="w-full h-[580px] sm:h-[610px] perspective-1200 cursor-pointer group"
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label="로봇 파일럿 디지털 ID 라이선스 카드. 클릭하여 앞뒷면을 뒤집습니다."
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <div
          id="cr80-card-inner"
          className={`w-full h-full relative preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ========================================= */}
          {/* FRONT FACE (PHYSICAL ID BADGE)             */}
          {/* ========================================= */}
          <section
            id="cr80-card-front"
            className={`absolute inset-0 backface-hidden rounded-[2rem] bg-gradient-to-b from-[#0b1527] via-[#070e1c] to-[#040913] border-[1.5px] ${
              isAdminLoggedIn
                ? 'border-teal-400 shadow-[0_0_45px_rgba(0,229,192,0.3)] ring-1 ring-teal-400/40'
                : 'border-teal-400/40 shadow-[0_0_40px_rgba(0,229,192,0.12)]'
            } p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              isFlipped ? 'pointer-events-none opacity-0 invisible' : 'pointer-events-auto z-10 opacity-100 visible'
            }`}
          >
            {/* Holographic Shimmer Layer */}
            <div className="absolute inset-0 holographic-sheen pointer-events-none opacity-40" />
            <div className="hud-scanner" />

            {/* Top Clamp & Lanyard Slot (Hole Punch for physical clip) */}
            <div className="w-full flex flex-col items-center relative z-20 -mt-2 mb-1">
              {/* Top clamp notch at card border */}
              <div className="w-12 h-2.5 rounded-b-md bg-slate-900/90 border-b border-x border-teal-500/30 shadow-inner -mt-3.5 mb-1.5" />
              {/* Slot punch hole */}
              <div className="w-14 h-2.5 rounded-full bg-[#03060d] border border-slate-700/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] flex items-center justify-center">
                <div className="w-11 h-1 rounded-full bg-slate-950" />
              </div>
            </div>

            {/* Card Header: Holographic Badge & NFC Smart Chip */}
            <div className="flex items-start justify-between relative z-10 pt-0.5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-400/40 text-teal-300 font-display text-[11px] font-bold tracking-wider">
                  <svg className="w-3.5 h-3.5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="14" x2="23" y2="14" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="14" x2="4" y2="14" />
                  </svg>
                  <span>ROBOT PILOT LICENSE</span>
                </div>
                <p className={`text-[9.5px] font-mono-code tracking-widest mt-1 flex items-center gap-1.5 ${
                  isAdminLoggedIn ? 'text-teal-300 font-bold' : 'text-slate-400'
                }`}>
                  <span>{isAdminLoggedIn ? 'ID AUTHENTICATED // CLASS-A [ADMIN]' : 'ID AUTHENTICATED // CLASS-A'}</span>
                  {isAdminLoggedIn && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c0] animate-pulse shadow-[0_0_6px_#00e5c0]" />
                  )}
                </p>
              </div>

              {/* Gold Smart Chip & Contactless wave */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 rounded-md chip-gold p-1 flex flex-col justify-between shadow-md relative overflow-hidden border border-[#d4af37]/60">
                  <div className="w-full h-[1px] bg-[#664b00]" />
                  <div className="flex justify-between w-full">
                    <div className="w-2.5 h-2 rounded-sm border border-[#664b00]/60" />
                    <div className="w-2.5 h-2 rounded-sm border border-[#664b00]/60" />
                  </div>
                  <div className="w-full h-[1px] bg-[#664b00]" />
                </div>
                <svg className="w-3.5 h-3.5 text-teal-400/80 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
              </div>
            </div>

            {/* Middle: Pilot Avatar Frame + Name & Identity */}
            <div className="my-auto py-1 relative z-10 flex flex-col items-center text-center">
              {/* Mechanic Avatar Badge Frame */}
              <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-[22px] p-[2.5px] bg-gradient-to-b from-teal-400/80 via-teal-500/30 to-sky-600/20 shadow-[0_0_25px_rgba(0,229,192,0.28)] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-[19px] bg-[#050d1a] flex flex-col items-center justify-center relative overflow-hidden border border-teal-500/30">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00e5c0_1.5px,transparent_1.5px)] [background-size:7px_7px]" />
                        {/* Robot Head Graphic */}
                        <div className="relative flex flex-col items-center mb-0.5">
                          {/* Antenna with round bulb */}
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_6px_#00e5c0]" />
                          <div className="w-[1.5px] h-2 bg-teal-300 -mt-0.5" />
                          {/* Head Chassis */}
                          <div className="w-11 h-6 rounded-md border-[1.8px] border-teal-300 bg-teal-950/40 flex items-center justify-center shadow-inner">
                            <div className="w-7 h-[1.5px] bg-teal-300/80" />
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-code text-teal-400/90 font-bold tracking-widest mt-1">
                          PILOT #01
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {/* Mini active status dot at bottom right */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#070e1c] border border-teal-400 flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#00e5c0] pulse-dot" />
                </div>
              </div>

              {/* Student Name */}
              <h1 className="text-3xl sm:text-[34px] font-black tracking-tight text-white glow-text-teal">
                {lang === 'en' ? (student.nameEn || 'JANG WON-WOO') : student.name}
              </h1>
              <p className="text-[11px] font-mono-code text-teal-300/85 font-semibold tracking-[0.2em] uppercase mt-0.5">
                {lang === 'en' ? (student.name || 'JANG WON-WOO') : (student.nameEn || 'JANG WON-WOO')}
              </p>

              {/* Role Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-teal-500/40 shadow-inner">
                <span className="text-teal-400 text-xs font-mono-code font-bold">&gt;_</span>
                <span className="font-display text-xs font-bold text-teal-300 tracking-wider uppercase">
                  {lang === 'en' ? (student.roleEn || student.role || 'ROBOT CREATOR & PILOT') : student.role}
                </span>
              </div>

              {/* Affiliation & Team Spec */}
              <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between px-2 text-left">
                <div>
                  <span className="text-[9.5px] font-mono-code text-slate-400 block tracking-wider uppercase">
                    {t.affiliationLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-100">{student.org}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-mono-code text-slate-400 block tracking-wider uppercase">
                    {t.teamLabel}
                  </span>
                  <span className="text-xs font-bold text-teal-400 font-display flex items-center gap-1 justify-end">
                    <span>{student.team}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Barcode & Real-time LED */}
            <div className="relative z-10 pt-3 border-t border-teal-500/20">
              <div className="flex items-center justify-between">
                {/* Security Barcode Graphic (Clickable for Admin) */}
                <div
                  className="flex flex-col cursor-pointer group/barcode transition hover:opacity-100"
                  onClick={(e) => {
                    if (onAdminTrigger) {
                      e.stopPropagation();
                      onAdminTrigger();
                    }
                  }}
                  title="관리자 로그인 (/admin)"
                >
                  <div className="flex items-end gap-[2px] h-6 opacity-90 group-hover/barcode:opacity-100">
                    <span className="w-[2px] h-full bg-teal-400" />
                    <span className="w-[1px] h-full bg-teal-400" />
                    <span className="w-[3px] h-full bg-teal-400" />
                    <span className="w-[1px] h-full bg-teal-400" />
                    <span className="w-[2px] h-full bg-teal-400" />
                    <span className="w-[4px] h-full bg-teal-400" />
                    <span className="w-[1px] h-full bg-teal-400" />
                    <span className="w-[3px] h-full bg-teal-400" />
                    <span className="w-[2px] h-full bg-teal-400" />
                    <span className="w-[1px] h-full bg-teal-400" />
                    <span className="w-[3px] h-full bg-teal-400" />
                    <span className="w-[2px] h-full bg-teal-400" />
                    <span className="w-[4px] h-full bg-teal-400" />
                    <span className="w-[1px] h-full bg-teal-400" />
                    <span className="w-[2px] h-full bg-teal-400" />
                  </div>
                  <span className="text-[8px] font-mono-code text-slate-400 group-hover/barcode:text-teal-300 tracking-wider mt-0.5 transition flex items-center gap-1">
                    <span>{t.barcodeCode}</span>
                  </span>
                </div>

                {/* Flip indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-teal-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAdminLoggedIn ? 'bg-[#00e5c0] pulse-dot shadow-[0_0_8px_#00e5c0]' : 'bg-[#00e5c0] pulse-dot'}`} />
                    <span>{isAdminLoggedIn ? t.active : t.ready}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono-code bg-teal-500/15 px-2.5 py-1 rounded-md border border-teal-400/40 text-teal-300 transition shadow-sm hover:bg-teal-500/25">
                    <span>{t.backFace}</span>
                    <span className="text-xs">↻</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================= */}
          {/* BACK FACE                                 */}
          {/* ========================================= */}
          <section
            id="cr80-card-back"
            onClick={(e) => e.stopPropagation()}
            className={`rotate-y-180 absolute inset-0 backface-hidden rounded-[1.75rem] bg-gradient-to-b from-[#0d1930] to-[#070e1c] border-[1.5px] border-teal-400/40 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
              isFlipped ? 'pointer-events-auto z-20 opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
            }`}
          >
            <div className="absolute inset-0 holographic-sheen pointer-events-none opacity-20 z-0" />
            <div className="hud-scanner z-0" />

            {/* Top Back: Slot hole & Magnetic Stripe */}
            <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 relative z-10">
              <div className="w-full flex justify-center py-2.5 bg-slate-950">
                <div className="w-14 h-2.5 rounded-full bg-[#050a14] border border-slate-700/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-slate-950/90" />
                </div>
              </div>
              <div className="w-full h-8 mag-stripe flex items-center px-4 justify-between">
                <span className="text-[9px] font-mono-code tracking-[0.25em] text-teal-400/50 select-none font-bold">
                  /// AUTHORIZED PILOT DATA STRIPE ///
                </span>
                <span className="text-teal-400/40 font-mono-code text-xs">◆</span>
              </div>
            </div>

            {/* Middle: Bio & Activity Links */}
            <div className="relative z-10 my-auto py-1">
              {/* One-line Bio Card */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-teal-500/30 mb-3 shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-code text-teal-400 font-bold uppercase flex items-center gap-1">
                    <span>“</span> {t.bioHeader}
                  </span>
                  <span className="text-[9px] font-mono-code text-slate-500">{t.bioSubheader}</span>
                </div>
                <p className="text-[13px] text-slate-100 font-medium leading-relaxed">
                  {lang === 'en' ? (student.bioEn || student.bio) : student.bio}
                </p>
              </div>

              {/* Activity Links Header */}
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[10px] font-mono-code text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <span>{t.linksHeader}</span>
                  <span className="text-[9px] text-teal-400/80 font-normal">{t.linksSubheader}</span>
                </span>
                <span className="text-[9px] font-mono-code text-teal-400/80">{t.channelsLabel}</span>
              </div>

              {/* Links List */}
              <div className="space-y-2">
                {student.links.youtube && !showFallback && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openChannelQr('youtube');
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        openChannelQr('youtube');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left min-h-[46px] shadow-sm cursor-pointer ${
                      selectedChannel === 'youtube'
                        ? 'bg-red-950/60 border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-1 ring-red-400/60'
                        : 'bg-slate-800/85 hover:bg-slate-700/90 border border-red-500/30 hover:border-red-400/70'
                    }`}
                    title={lang === 'en' ? 'Click to open YouTube Video QR code' : '클릭하여 YouTube 영상 QR 코드 열기'}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                      <div className="w-7 h-7 rounded-lg bg-red-600/30 flex items-center justify-center text-red-500 shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{t.youtubeTitle}</span>
                          <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded font-bold transition ${
                            selectedChannel === 'youtube'
                              ? 'bg-red-500 text-slate-950 shadow-sm'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}>
                            {selectedChannel === 'youtube' ? t.qrActive : t.viewQr}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-code truncate">{t.youtubeSubtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openChannelQr('youtube');
                        }}
                        className={`text-[11px] font-mono-code px-2 py-1 rounded border flex items-center gap-1 transition cursor-pointer font-bold ${
                          selectedChannel === 'youtube'
                            ? 'bg-red-500 text-slate-950 border-red-400 shadow-sm'
                            : 'bg-red-950/60 text-red-400 border-red-500/40 hover:bg-red-900/80 hover:text-red-300'
                        }`}
                        title={lang === 'en' ? 'Open YouTube QR code' : 'YouTube 영상 QR 코드 열기'}
                      >
                        <span>QR</span>
                        <QrCode className="w-3 h-3" />
                      </button>
                      <a
                        href={student.links.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-slate-400 hover:text-red-400 transition"
                        title={t.openInNewTab}
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                )}

                {student.links.portfolio && !showFallback && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openChannelQr('portfolio');
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        openChannelQr('portfolio');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left min-h-[46px] shadow-sm cursor-pointer ${
                      selectedChannel === 'portfolio'
                        ? 'bg-teal-950/60 border-2 border-teal-400 shadow-[0_0_22px_rgba(0,229,192,0.38)] ring-1 ring-teal-400/70'
                        : 'bg-slate-800/85 hover:bg-slate-700/90 border border-teal-500/40 hover:border-teal-400'
                    }`}
                    title={lang === 'en' ? 'Click to open Portfolio QR code' : '클릭하여 포트폴리오 QR 코드 열기'}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/25 flex items-center justify-center text-teal-300 font-tech font-bold text-xs shrink-0">
                        &lt;/&gt;
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{t.portfolioTitle}</span>
                          <span className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded font-bold transition ${
                            selectedChannel === 'portfolio'
                              ? 'bg-[#00e5c0] text-slate-950 shadow-sm'
                              : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          }`}>
                            {selectedChannel === 'portfolio' ? t.qrActive : t.viewQr}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-code truncate">
                          {student.links.portfolio.replace('https://', '')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openChannelQr('portfolio');
                        }}
                        className={`text-[11px] font-mono-code px-2 py-1 rounded border flex items-center gap-1 transition cursor-pointer font-bold ${
                          selectedChannel === 'portfolio'
                            ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-sm'
                            : 'bg-teal-950/60 text-teal-400 border-teal-500/40 hover:bg-teal-900/80 hover:text-teal-300'
                        }`}
                        title={lang === 'en' ? 'Open Portfolio QR code' : '포트폴리오 QR 코드 열기'}
                      >
                        <span>QR</span>
                        <QrCode className="w-3 h-3" />
                      </button>
                      <a
                        href={student.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-slate-400 hover:text-teal-300 transition"
                        title={t.openInNewTab}
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                )}

                {showFallback && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center py-3">
                    <p className="text-xs text-slate-400">{t.noLinks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: QR Pass Module */}
            <div
              className={`p-3 rounded-2xl transition-all border relative z-20 flex items-center justify-between shadow-xl ${
                selectedChannel === 'youtube'
                  ? 'bg-[#0f1220]/95 border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.2)] ring-1 ring-red-500/30'
                  : 'bg-[#071828]/95 border-teal-400/60 shadow-[0_0_25px_rgba(0,229,192,0.2)] ring-1 ring-teal-400/30'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openChannelQr(selectedChannel);
                }}
                title={lang === 'en' ? 'Click to open high-res QR code' : '클릭하여 고해상도 QR 코드 열기'}
              >
                {/* High contrast QR box with corner accents */}
                <div className={`p-1 bg-white qr-contrast-box rounded-xl shadow-md shrink-0 w-[78px] h-[78px] flex items-center justify-center relative overflow-hidden ring-2 transition group-hover:scale-105 ${
                  selectedChannel === 'youtube'
                    ? 'ring-red-500/80 group-hover:ring-red-400'
                    : 'ring-teal-400/80 group-hover:ring-teal-300'
                }`}>
                  {activeQrTarget ? (
                    <CrispQrCode
                      value={activeQrTarget}
                      size={70}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[9px] text-slate-300 font-medium leading-tight">
                        {lang === 'en' ? 'Preparing\nlink' : '링크\n준비 중'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-left overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-code font-bold uppercase tracking-wider mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      selectedChannel === 'youtube' ? 'bg-red-500' : 'bg-[#00e5c0]'
                    }`} />
                    <span className={selectedChannel === 'youtube' ? 'text-red-400' : 'text-teal-300'}>
                      {selectedChannel === 'youtube' ? t.youtubeQrPass : t.portfolioQrPass}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition">
                    {activeQrLabel} {t.qrCodeSuffix}
                  </p>
                  <p className="text-[9.5px] text-slate-400 font-mono-code truncate">
                    {activeQrTarget ? activeQrTarget.replace('https://', '') : t.noUrl}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono-code font-bold">
                    <span className={`px-2 py-0.5 rounded transition ${
                      selectedChannel === 'youtube'
                        ? 'bg-red-600/30 text-red-200 border border-red-500/50 group-hover:bg-red-500 group-hover:text-slate-950'
                        : 'bg-teal-500/25 text-teal-200 border border-teal-500/50 group-hover:bg-teal-400 group-hover:text-slate-950'
                    }`}>
                      {t.enlargeQr}
                      <Maximize2 className="w-3 h-3 inline ml-1" />
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono-code">{t.scanPrompt}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onFlip}
                className="text-slate-400 hover:text-teal-400 p-2 text-xs font-mono-code flex flex-col items-center group transition shrink-0 ml-1 rounded-xl hover:bg-slate-800/60"
                title={lang === 'en' ? 'Return to front face' : '앞면으로 돌아가기'}
              >
                <span className="text-sm mb-0.5 group-hover:-rotate-45 transition-transform">↺</span>
                <span className="text-[10px]">{t.frontFace}</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Fallback QR Code Modal if onOpenQrModal not passed */}
      {!onOpenQrModal && qrModal && (
        <QrCodeModal
          isOpen={qrModal.isOpen}
          onClose={() => setQrModal(null)}
          title={qrModal.title}
          subtitle={qrModal.subtitle}
          url={qrModal.url}
          iconType={qrModal.iconType}
          lang={lang}
        />
      )}
    </div>
  );
}
