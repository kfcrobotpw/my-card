import { QRCodeSVG } from 'qrcode.react';
import { StudentData } from '../types';

interface VerticalCyberCardProps {
  student: StudentData;
  isFlipped: boolean;
  onFlip: () => void;
  showFallback?: boolean;
}

export default function VerticalCyberCard({ student, isFlipped, onFlip, showFallback }: VerticalCyberCardProps) {
  const activeQrTarget = showFallback ? null : (student.qrTarget || student.links.portfolio);

  return (
    <div
      id="cyber-card-container"
      className="w-full max-w-sm h-[470px] perspective-1200 cursor-pointer group select-none"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label="세로형 테크 디지털 ID 카드. 클릭하여 앞뒷면을 전환합니다."
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <div
        id="cyber-card-inner"
        className={`w-full h-full relative preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ========================================= */}
        {/* FRONT FACE                                */}
        {/* ========================================= */}
        <section
          id="cyber-card-front"
          className="absolute inset-0 backface-hidden rounded-[1.25rem] border border-teal-400/30 bg-gradient-to-br from-[#0f1e38]/95 to-[#0a1426]/98 p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          {/* Ambient HUD scanline */}
          <div className="hud-scanner" />

          {/* Decorative Circuit SVG Accents */}
          <svg className="absolute -right-6 -top-6 w-36 h-36 stroke-teal-400/20 pointer-events-none fill-none" viewBox="0 0 100 100">
            <path d="M10 10 H80 V80" strokeWidth="1.5" strokeDasharray="2 3" />
            <circle cx="80" cy="80" r="3" fill="#00e5c0" />
            <path d="M40 10 V40 H70" strokeWidth="1" />
            <circle cx="40" cy="10" r="2" fill="#00e5c0" />
          </svg>

          <svg className="absolute -left-6 -bottom-6 w-36 h-36 stroke-teal-400/20 pointer-events-none fill-none" viewBox="0 0 100 100">
            <path d="M90 90 H20 V20" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="20" cy="20" r="3" fill="#00e5c0" />
          </svg>

          {/* Top Section: Category & Badge */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00e5c0]/15 border border-[#00e5c0]/40 text-[#00e5c0] font-display text-xs font-bold tracking-widest uppercase">
                <svg className="w-3 h-3 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
                <span>{student.cardTypeShort}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-code tracking-tighter mt-1">
                CLASS-A AUTHENTICATED ID
              </p>
            </div>

            {/* Tech Emblem */}
            <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
              <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
          </div>

          {/* Middle Section: Student Identity & Role */}
          <div className="my-auto py-3 relative z-10">
            {/* Organization & Team */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-teal-400/80 uppercase tracking-wider">
                  AFFILIATION
                </span>
                <span className="h-[1px] flex-1 bg-gradient-to-r from-teal-500/30 to-transparent" />
              </div>
              <div className="text-slate-200 font-bold tracking-wide text-base">{student.org}</div>
              <div className="text-teal-400 font-display text-sm tracking-wider flex items-center gap-1.5">
                <span>⚛</span>
                <span>{student.team}</span>
              </div>
            </div>

            {/* Student Name */}
            <div className="mt-4">
              <p className="text-[11px] font-mono-code text-slate-400 tracking-widest uppercase">NAME</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight glow-text-teal">
                {student.name}
              </h1>
            </div>

            {/* Role Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-teal-500/40">
              <span className="font-tech text-teal-400 text-xs font-bold">&lt;/&gt;</span>
              <span className="font-display text-xs font-bold text-teal-300 tracking-wider">
                {student.role}
              </span>
            </div>

            {/* Hotlinked Photo or Photo Status Slot */}
            <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="text-teal-400 font-bold">☑</span> IDENTITY VERIFIED
              </span>
              {student.avatarUrl ? (
                <span className="text-teal-300 text-[10px] flex items-center gap-1">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-teal-400"
                  />
                  <span>[PHOTO SET]</span>
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">[PHOTO UNSET]</span>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between relative z-10 text-xs text-slate-400 font-mono-code">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span className="text-[11px]">SYS: READY</span>
            </div>
            <div className="flex items-center gap-1 text-teal-400 hover:text-teal-300 transition text-[11px]">
              <span>뒷면 보기</span>
              <span>↻</span>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* BACK FACE                                 */}
        {/* ========================================= */}
        <section
          id="cyber-card-back"
          className="rotate-y-180 absolute inset-0 backface-hidden rounded-[1.25rem] border border-teal-400/30 bg-gradient-to-br from-[#0f1e38]/95 to-[#0a1426]/98 p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
        >
          <div className="hud-scanner" />

          {/* Circuit Details */}
          <div className="absolute top-0 right-0 p-3 opacity-15 text-teal-400 font-mono-code text-[8px] select-none pointer-events-none leading-tight">
            01010111 01010010 01001111<br />
            F=MA_ROBOTIC_CORE
          </div>

          {/* Top Back: Bio Statement */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
              <span className="font-display text-xs tracking-wider text-teal-400 font-bold uppercase">
                PROFILE & ACTIVITIES
              </span>
              <span className="text-[10px] font-mono-code text-slate-400">FLIP 180°</span>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-teal-500/25">
              <p className="text-[11px] font-mono-code text-teal-400/90 mb-1 flex items-center gap-1.5">
                <span>“</span>
                <span>한 줄 소개</span>
              </p>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {student.bio}
              </p>
            </div>
          </div>

          {/* Middle Back: Activity Links */}
          <div className="my-auto py-2 relative z-10">
            <p className="text-[11px] font-mono-code text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span>활동 링크</span>
              <span className="text-[10px] text-teal-400 font-normal">입력된 링크만 표시</span>
            </p>

            <div className="space-y-2">
              {student.links.youtube && !showFallback && (
                <a
                  href={student.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 border border-red-500/30 hover:border-red-500/60 transition group text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-white">YouTube 영상</div>
                      <div className="text-[10px] text-slate-400 font-mono-code truncate">로봇 주행 및 시연 클립</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-red-400 shrink-0 ml-2">↗</span>
                </a>
              )}

              {student.links.portfolio && !showFallback && (
                <a
                  href={student.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 border border-teal-500/40 hover:border-teal-400/80 transition group text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition shrink-0">
                      <span className="font-tech font-bold text-xs">&lt;/&gt;</span>
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-white">포트폴리오</div>
                      <div className="text-[10px] text-slate-400 font-mono-code truncate">
                        {student.links.portfolio.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-teal-300 shrink-0 ml-2">↗</span>
                </a>
              )}

              {showFallback && (
                <div className="p-3 rounded-lg bg-slate-800/40 border border-dashed border-slate-700 text-center py-4">
                  <p className="text-xs text-slate-400">등록된 활동 링크가 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Back: QR Area */}
          <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-lg shadow-md shrink-0 w-[64px] h-[64px] flex items-center justify-center relative overflow-hidden">
                {activeQrTarget ? (
                  <QRCodeSVG
                    value={activeQrTarget}
                    size={56}
                    bgColor="#ffffff"
                    fgColor="#060d1a"
                    level="M"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[9px] text-slate-300 font-medium leading-tight">링크<br />준비 중</span>
                  </div>
                )}
              </div>

              <div className="text-left overflow-hidden">
                <p className="text-[10px] font-mono-code text-teal-400 uppercase tracking-wider">QR CONNECT</p>
                <p className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">
                  {showFallback ? '링크 준비 중' : '포트폴리오 바로가기'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono-code truncate max-w-[170px]">
                  {activeQrTarget ? activeQrTarget.replace('https://', '') : '등록된 URL 없음'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onFlip}
              className="text-slate-400 hover:text-teal-400 p-2 text-xs font-mono-code flex flex-col items-center"
              title="앞면으로 돌아가기"
            >
              <span className="text-sm mb-0.5">↺</span>
              <span className="text-[10px]">앞면</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
