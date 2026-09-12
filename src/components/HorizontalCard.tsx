import { QRCodeSVG } from 'qrcode.react';
import { StudentData } from '../types';

interface HorizontalCardProps {
  student: StudentData;
  isFlipped: boolean;
  onFlip: () => void;
  showFallback?: boolean;
}

export default function HorizontalCard({ student, isFlipped, onFlip, showFallback }: HorizontalCardProps) {
  const activeQrTarget = showFallback ? null : (student.qrTarget || student.links.portfolio);

  return (
    <div
      id="horizontal-card-container"
      className="perspective-1200 w-full max-w-[640px] aspect-[640/410] min-h-[330px] max-h-[415px] cursor-pointer group select-none"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label="로봇 파일럿 디지털 ID 카드. 클릭하여 앞뒷면을 뒤집습니다."
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
        {/* ========================================= */}
        {/* FRONT FACE                                */}
        {/* ========================================= */}
        <article
          id="horizontal-card-front"
          className="card-grid-texture absolute inset-0 w-full h-full backface-hidden rounded-[26px] border border-teal-500/30 p-6 sm:p-9 flex flex-col justify-between shadow-2xl overflow-hidden"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-[25px] border border-cyan-400/20 pointer-events-none" />

          {/* Top Row: Brand Crest & Active Status Badge */}
          <div className="flex items-center justify-between z-10">
            {/* Geometric Crest & Title */}
            <div className="flex items-center gap-2.5">
              <svg className="w-8 h-8 text-teal-300 shrink-0" viewBox="0 0 36 36" fill="none" stroke="currentColor">
                <circle cx="18" cy="18" r="16" strokeWidth="1.8" strokeDasharray="3 1.5" />
                <path d="M12 24V14L18 9L24 14V24" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M15 17H21V24H15V17Z" strokeWidth="1.4" />
                <path d="M12 20H24" strokeWidth="1.4" />
                <circle cx="18" cy="13" r="1.5" fill="currentColor" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-tech text-teal-300/80 font-medium">
                  ROBOT PILOT CREDENTIAL
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-300 font-sans -mt-0.5">
                  DIGITAL ID<sup className="text-xs font-normal">®</sup>
                </span>
              </div>
            </div>

            {/* Active Status Badge */}
            <div className="flex items-center gap-2 bg-teal-950/50 px-3 py-1 rounded-full border border-teal-700/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 active-dot-glow pulse-dot" />
              <span className="text-xs sm:text-sm font-tech font-bold text-white tracking-widest uppercase">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Middle Row: Pilot Avatar Badge & Name Block */}
          <div className="flex items-center gap-5 sm:gap-7 my-auto z-10">
            {/* Avatar Circle */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#3b7a6d] flex items-center justify-center shadow-lg border border-teal-300/30 shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {student.avatarText || student.name.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Student Name and Roles */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-tech text-teal-400 tracking-[0.25em] font-bold">
                {student.cardTypeShort}
              </span>
              <h2 className="text-3xl sm:text-4xl sm:leading-tight font-black text-white tracking-tight my-0.5 font-sans glow-text-teal">
                {student.name}
              </h2>
              <span className="text-xs sm:text-sm font-tech text-teal-400/90 tracking-[0.22em] font-medium">
                {student.role}
              </span>
            </div>
          </div>

          {/* Bottom Row: Team / Group & Member ID */}
          <div className="flex items-end justify-between z-10 pt-2 border-t border-teal-500/15">
            {/* Team Info */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-tech text-teal-400/70 tracking-widest font-semibold uppercase">
                TEAM / GROUP
              </span>
              <span className="text-sm sm:text-base font-tech font-bold text-white tracking-wider">
                {student.team}
              </span>
            </div>

            {/* Member ID Info */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] sm:text-xs font-tech text-teal-400/70 tracking-widest font-semibold uppercase">
                MEMBER ID
              </span>
              <div className="flex items-center gap-1.5 font-tech text-base sm:text-lg font-bold text-white tracking-wider">
                <span className="bg-white/10 px-1 rounded text-teal-300 text-xs sm:text-sm font-black border border-teal-400/30">
                  ID
                </span>
                <span className="text-teal-400">-</span>
                <span>{student.memberId ? student.memberId.replace('PW - ', '').replace('PW-', '').replace('ID - ', '').replace('ID-', '') : '260814'}</span>
              </div>
            </div>
          </div>

          {/* Subtle click prompt */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-tech text-teal-300/40 uppercase tracking-widest pointer-events-none">
            Click to view back
          </div>
        </article>

        {/* ========================================= */}
        {/* BACK FACE                                 */}
        {/* ========================================= */}
        <article
          id="horizontal-card-back"
          className="card-grid-texture rotate-y-180 absolute inset-0 w-full h-full backface-hidden rounded-[26px] border border-teal-500/30 p-6 sm:p-9 flex items-center justify-between shadow-2xl select-none overflow-hidden"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-[25px] border border-cyan-400/20 pointer-events-none" />

          {/* Left Side: Story, Headline, Subtext, Buttons */}
          <div className="flex flex-col justify-between h-full max-w-[62%] z-10 py-1">
            <div>
              <span className="text-xs sm:text-sm font-tech text-teal-400 tracking-[0.25em] font-bold uppercase">
                MY ROBOT STORY
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-2.5 sm:mt-4 leading-snug">
                {student.bio}
              </h3>
              <p className="text-xs sm:text-sm font-tech text-slate-400/90 mt-2 tracking-wide font-medium">
                {student.org} · {student.team}
              </p>
            </div>

            {/* Action Buttons: YouTube & Portfolio */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4">
              {student.links.youtube && !showFallback && (
                <a
                  href={student.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-teal-500/40 hover:border-teal-400 text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md group/btn"
                  title="YouTube 영상 보기"
                >
                  <svg className="w-4 h-4 text-white group-hover/btn:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>YouTube</span>
                </a>
              )}

              {student.links.portfolio && !showFallback && (
                <a
                  href={student.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-teal-500/40 hover:border-teal-400 text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md group/btn"
                  title="포트폴리오 바로가기"
                >
                  <span className="font-tech text-teal-300 font-bold text-sm tracking-tighter">&lt;/&gt;</span>
                  <span>Portfolio</span>
                </a>
              )}

              {showFallback && (
                <div className="text-xs text-amber-400/90 font-mono-code bg-slate-900/80 px-3 py-1.5 rounded-full border border-amber-500/30">
                  활동 링크 미입력 상태
                </div>
              )}
            </div>
          </div>

          {/* Right Side: QR Code Plate */}
          <div className="flex flex-col items-center justify-center z-10 shrink-0">
            <div className="bg-white qr-contrast-box p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col items-center border border-white/80 transition-transform duration-200 hover:scale-105">
              {activeQrTarget ? (
                <div className="p-1">
                  <QRCodeSVG
                    value={activeQrTarget}
                    size={110}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    style={{ shapeRendering: 'crispEdges' }}
                    className="w-24 h-24 sm:w-32 sm:h-32"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-600 text-center p-2">
                  <span className="text-[10px] font-bold text-slate-700 font-tech">링크 준비 중</span>
                </div>
              )}

              <span className="text-[9px] sm:text-[11px] font-tech font-black text-slate-900 tracking-widest mt-1.5 uppercase">
                SCAN PROFILE
              </span>
            </div>
          </div>

          {/* Subtle click prompt */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-tech text-teal-300/40 uppercase tracking-widest pointer-events-none">
            Click to view front
          </div>
        </article>
      </div>
    </div>
  );
}
