import { useState } from 'react';
import { ExternalLink, QrCode, Maximize2, ShieldCheck, Youtube, Globe, Bot } from 'lucide-react';
import CrispQrCode from './CrispQrCode';
import { StudentData, Language } from '../types';
import { translations } from '../translations';

interface HorizontalCardProps {
  student: StudentData;
  isFlipped: boolean;
  onFlip: () => void;
  onAdminTrigger?: () => void;
  isAdminLoggedIn?: boolean;
  onOpenQrModal?: (data: {
    isOpen: boolean;
    title: string;
    subtitle?: string;
    url: string;
    iconType?: 'youtube' | 'portfolio' | 'default';
  }) => void;
  lang?: Language;
  showFallback?: boolean;
}

export default function HorizontalCard({
  student,
  isFlipped,
  onFlip,
  onAdminTrigger,
  isAdminLoggedIn = false,
  onOpenQrModal,
  lang = 'ko',
  showFallback = false,
}: HorizontalCardProps) {
  const t = translations[lang];
  const [selectedChannel, setSelectedChannel] = useState<'youtube' | 'portfolio'>('youtube');

  // Determine active QR URL & label based on selected channel
  const activeQrTarget = showFallback
    ? null
    : selectedChannel === 'youtube'
    ? student.links.youtube || student.qrTarget || student.links.portfolio
    : student.links.portfolio || student.qrTarget || student.links.youtube;

  const activeQrLabel = showFallback
    ? t.noUrl
    : selectedChannel === 'youtube'
    ? t.youtubeTitle
    : t.portfolioTitle;

  const openChannelQr = (channel: 'youtube' | 'portfolio') => {
    setSelectedChannel(channel);
    const targetUrl =
      channel === 'youtube'
        ? student.links.youtube || student.qrTarget
        : student.links.portfolio || student.qrTarget;

    if (!targetUrl || showFallback) return;

    if (onOpenQrModal) {
      onOpenQrModal({
        isOpen: true,
        title: `${channel === 'youtube' ? t.youtubeTitle : t.portfolioTitle} ${t.qrCodeSuffix}`,
        subtitle: channel === 'youtube' ? t.youtubeSubtitle : `${student.name} · WRO 2026`,
        url: targetUrl,
        iconType: channel,
      });
    }
  };

  return (
    <div
      id="horizontal-card-container"
      className="perspective-1200 w-full max-w-[620px] aspect-[85.6/53.98] min-h-[260px] max-h-[82vh] cursor-pointer group select-none relative"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={lang === 'en' ? 'Robot Pilot Digital ID Card. Tap to flip.' : '로봇 파일럿 디지털 ID 카드. 터치하여 앞뒤를 뒤집습니다.'}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <div
        id="horizontal-card-inner"
        className={`w-full h-full relative preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ==================================================== */}
        {/* FRONT FACE (가로 모드 앞면)                           */}
        {/* ==================================================== */}
        <article
          id="horizontal-card-front"
          className={`card-grid-texture absolute inset-0 w-full h-full backface-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between shadow-2xl overflow-hidden border transition-colors ${
            isAdminLoggedIn
              ? 'border-teal-400 shadow-[0_0_35px_rgba(0,229,192,0.3)]'
              : 'border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
          } ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
        >
          {/* Subtle circuit & scanline effects */}
          <div className="absolute inset-0 holographic-sheen pointer-events-none opacity-25" />
          <div className="hud-scanner" />

          {/* Top Row: Brand Crest, Title & Status */}
          <div className="flex items-center justify-between z-10">
            {/* Left Header / Logo */}
            <div
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group/logo"
              onClick={(e) => {
                if (onAdminTrigger) {
                  e.stopPropagation();
                  onAdminTrigger();
                }
              }}
              title={t.adminHint}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-950/80 border border-teal-400/40 flex items-center justify-center text-teal-300 group-hover/logo:border-teal-300 transition">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-mono-code text-teal-400/90 font-medium">
                  {student.cardTypeShort || 'ROBOT PILOT'}
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-white font-sans flex items-center gap-1">
                  DIGITAL ID<span className="text-[9px] font-normal text-teal-400">®</span>
                </span>
              </div>
            </div>

            {/* Right Status Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1.5 bg-teal-950/80 px-2.5 py-0.5 sm:py-1 rounded-full border border-teal-400/60 text-[10px] sm:text-xs font-mono-code font-bold text-teal-300">
                  <ShieldCheck className="w-3 h-3 text-teal-300" />
                  <span>ADMIN</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-teal-950/60 px-2.5 py-0.5 sm:py-1 rounded-full border border-teal-700/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 active-dot-glow pulse-dot" />
                  <span className="text-[10px] sm:text-xs font-mono-code font-bold text-slate-200 tracking-wider uppercase">
                    ACTIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Row: Pilot Avatar, Name & Roles */}
          <div className="flex items-center gap-3.5 sm:gap-5 my-auto z-10">
            {/* Avatar Circle with holographic ring */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full bg-[#0d2238] flex items-center justify-center shadow-xl border-2 border-teal-400/50 shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-black text-teal-300 tracking-tight font-mono-code">
                  {student.avatarText || student.name.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Name, Eng Name & Role */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[11px] font-mono-code text-teal-400 tracking-wider font-semibold uppercase bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  {student.team}
                </span>
                <span className="text-[10px] sm:text-xs font-mono-code text-slate-400 truncate">
                  {student.org}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight my-0.5 font-sans glow-text-teal truncate">
                {student.name}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono-code text-teal-300/90 font-medium truncate">
                <span>{student.nameEn || 'Wonwoo Jang'}</span>
                <span className="text-teal-500/40">|</span>
                <span className="text-slate-300 truncate">{student.role}</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Division, Member ID & Flip Prompt */}
          <div className="flex items-end justify-between z-10 pt-2 border-t border-teal-500/20 text-[10px] sm:text-xs font-mono-code">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider uppercase">
                {t.affiliationLabel}
              </span>
              <span className="font-bold text-white tracking-wide">
                {student.org} · {student.team}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-slate-400 text-[9px] sm:text-[10px] tracking-wider uppercase">
                  MEMBER ID
                </span>
                <span className="font-bold text-teal-300 tracking-wider">
                  {student.memberId || 'ID-260814'}
                </span>
              </div>
            </div>
          </div>

          {/* Touch to flip hint indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-mono-code text-teal-300/50 uppercase tracking-widest pointer-events-none">
            {t.flipPrompt}
          </div>
        </article>

        {/* ==================================================== */}
        {/* BACK FACE (가로 모드 뒷면: 소개 + 듀얼 QR 패스)     */}
        {/* ==================================================== */}
        <article
          id="horizontal-card-back"
          className={`card-grid-texture rotate-y-180 absolute inset-0 w-full h-full backface-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex items-center justify-between shadow-2xl overflow-hidden border transition-colors ${
            isAdminLoggedIn
              ? 'border-teal-400 shadow-[0_0_35px_rgba(0,229,192,0.3)]'
              : 'border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
          } ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          {/* Subtle background circuit & sheen */}
          <div className="absolute inset-0 holographic-sheen pointer-events-none opacity-20" />
          <div className="hud-scanner" />

          {/* Left Column: Pilot Bio + Channel Select Buttons */}
          <div className="flex flex-col justify-between h-full max-w-[58%] sm:max-w-[60%] z-10 py-0.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[11px] font-mono-code text-teal-400 font-bold uppercase tracking-wider">
                  {t.bioHeader}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono-code text-slate-400">
                  {student.team}
                </span>
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight mt-1 leading-snug line-clamp-2">
                "{student.bio}"
              </h3>
            </div>

            {/* Channels & Action Buttons */}
            <div className="flex flex-col gap-1.5 sm:gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
              <span className="text-[9px] font-mono-code text-slate-400 tracking-wider uppercase">
                {t.channelsLabel}
              </span>

              <div className="flex items-center gap-2">
                {/* YouTube Channel Toggle */}
                {student.links.youtube && (
                  <button
                    type="button"
                    onClick={() => openChannelQr('youtube')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-mono-code transition border cursor-pointer ${
                      selectedChannel === 'youtube'
                        ? 'bg-red-500/20 border-red-500 text-red-300 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-300'
                    }`}
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    <span>YouTube</span>
                  </button>
                )}

                {/* Portfolio Channel Toggle */}
                {student.links.portfolio && (
                  <button
                    type="button"
                    onClick={() => openChannelQr('portfolio')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-mono-code transition border cursor-pointer ${
                      selectedChannel === 'portfolio'
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold shadow-[0_0_12px_rgba(0,229,192,0.3)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-teal-400/50 hover:text-teal-300'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span>Portfolio</span>
                  </button>
                )}
              </div>

              {/* Direct Link Open Button */}
              {activeQrTarget && (
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={activeQrTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono-code text-teal-300 hover:text-teal-200 transition underline underline-offset-2"
                  >
                    <span>{t.openInNewTab}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div className="text-[8px] sm:text-[9px] font-mono-code text-slate-500">
              SEC-PASS: WRO-2026-{student.memberId?.slice(-4) || 'PW26'}
            </div>
          </div>

          {/* Right Column: High-Contrast QR Code Pass Module */}
          <div
            className="flex flex-col items-center justify-center z-20 shrink-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              openChannelQr(selectedChannel);
            }}
          >
            <div
              className={`p-2 sm:p-2.5 rounded-2xl transition-all border flex flex-col items-center shadow-2xl cursor-pointer group/qr ${
                selectedChannel === 'youtube'
                  ? 'bg-[#0f1220]/95 border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.25)] ring-1 ring-red-500/40'
                  : 'bg-[#071828]/95 border-teal-400/60 shadow-[0_0_25px_rgba(0,229,192,0.25)] ring-1 ring-teal-400/40'
              }`}
              title={lang === 'en' ? 'Click to enlarge QR code' : '클릭하여 QR 코드 확대'}
            >
              {/* High contrast QR container */}
              <div className="bg-white qr-contrast-box p-1 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden group-hover/qr:scale-105 transition-transform">
                {activeQrTarget ? (
                  <CrispQrCode
                    value={activeQrTarget}
                    size={lang === 'en' ? 88 : 92}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-600 text-center p-1">
                    <span className="text-[10px] font-mono-code font-bold">{t.noUrl}</span>
                  </div>
                )}
              </div>

              {/* QR Plate Badge & Enlarge trigger */}
              <div className="flex items-center gap-1 mt-1.5 text-[9px] sm:text-[10px] font-mono-code font-bold text-white">
                <span>{activeQrLabel}</span>
                <Maximize2 className="w-2.5 h-2.5 text-teal-300" />
              </div>
              <span className="text-[8px] font-mono-code text-slate-400">
                {t.enlargeQr}
              </span>
            </div>
          </div>

          {/* Touch to flip hint indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-mono-code text-teal-300/50 uppercase tracking-widest pointer-events-none">
            {t.flipPrompt}
          </div>
        </article>
      </div>
    </div>
  );
}
