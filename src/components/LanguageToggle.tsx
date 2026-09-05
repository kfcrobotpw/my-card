import { Language } from '../types';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export default function LanguageToggle({
  currentLang,
  onLanguageChange,
  className = '',
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label="언어 선택 (Language Selector)"
      className={`flex items-center gap-1 bg-[#070f1e]/95 backdrop-blur-md p-1 rounded-full border border-teal-500/40 shadow-[0_0_20px_rgba(0,229,192,0.12)] transition-all ${className}`}
    >
      <div className="pl-2 pr-1 text-teal-400 flex items-center gap-1 select-none pointer-events-none">
        <span className="text-xs">🌐</span>
        <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-teal-300 hidden xs:inline">
          LANG
        </span>
      </div>

      {/* Korean button */}
      <button
        type="button"
        id="lang-btn-ko"
        onClick={() => onLanguageChange('ko')}
        aria-pressed={currentLang === 'ko'}
        className={`px-3 py-1 text-xs font-mono-code rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
          currentLang === 'ko'
            ? 'bg-[#00e5c0] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,192,0.45)] ring-1 ring-teal-300'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 font-medium'
        }`}
      >
        <span>한국어</span>
      </button>

      {/* English button */}
      <button
        type="button"
        id="lang-btn-en"
        onClick={() => onLanguageChange('en')}
        aria-pressed={currentLang === 'en'}
        className={`px-3 py-1 text-xs font-mono-code rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
          currentLang === 'en'
            ? 'bg-[#00e5c0] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,192,0.45)] ring-1 ring-teal-300'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 font-medium'
        }`}
      >
        <span>English</span>
      </button>
    </div>
  );
}
