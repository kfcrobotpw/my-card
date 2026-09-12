import { FormEvent, useEffect, useRef, useState } from 'react';
import { Settings, X } from 'lucide-react';
import VerticalCr80Card from './components/VerticalCr80Card';
import HorizontalCard from './components/HorizontalCard';
import AdminPage from './components/AdminPage';
import Toast from './components/Toast';
import QrCodeModal from './components/QrCodeModal';
import LanguageToggle from './components/LanguageToggle';
import { DEFAULT_STUDENT_DATA, Language, SESSION_AUTH_KEY, StudentData } from './types';
import { translations } from './translations';

const STORAGE_KEY = 'robot_pilot_student_data';
const LANG_STORAGE_KEY = 'robot_pilot_lang';

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  const href = window.location.href.toLowerCase();
  return (
    path.includes('admin') ||
    hash.includes('admin') ||
    search.includes('admin') ||
    href.includes('admin')
  );
};

export default function App() {
  const [student, setStudent] = useState<StudentData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const avatarUrl = parsed.avatarUrl === '/robot_pilot_avatar.jpg' ? '' : (parsed.avatarUrl ?? '');
        return {
          ...DEFAULT_STUDENT_DATA,
          ...parsed,
          avatarUrl,
        };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_STUDENT_DATA;
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'ko' || saved === 'en') return saved;
    } catch {
      // Ignore localStorage errors
    }
    return 'ko';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  const t = translations[language];

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Screen Orientation State for Mobile (Always auto-detected from device rotation)
  const [deviceIsLandscape, setDeviceIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.screen?.orientation?.type) {
      return window.screen.orientation.type.includes('landscape');
    }
    return window.innerWidth > window.innerHeight;
  });

  // Always automatically adapt card view to device orientation:
  // Phone held vertically -> Portrait card, Phone held horizontally -> Landscape card
  const isCardLandscape = deviceIsLandscape;

  // Command prompt input state (appears when pressing '/' or typing command)
  const [showCommandPrompt, setShowCommandPrompt] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Keystroke sequence buffer for detection (e.g. user typing "/admin" or "admin")
  const keySequenceRef = useRef<string>('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  // Fullscreen Interactive QR Pass Modal State
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    url: string;
    iconType?: 'youtube' | 'portfolio' | 'default';
  } | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(msg);
    setToastVisible(true);
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2800);
    setToastTimer(timer);
  };

  const syncAuthState = () => {
    try {
      setIsAdminLoggedIn(sessionStorage.getItem(SESSION_AUTH_KEY) === 'true');
    } catch {
      setIsAdminLoggedIn(false);
    }
  };

  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      window.location.hash = path.replace('/', '');
    }
    setIsAdminRoute(path.includes('admin'));
    syncAuthState();
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
    showToast(language === 'ko' ? '관리자 계정에서 로그아웃되었습니다.' : 'Logged out from administrator account.');
  };

  // Device orientation detection listener for smartphones & tablets
  useEffect(() => {
    const checkOrientation = () => {
      let isLandscape = false;
      if (typeof window === 'undefined') return;

      if (window.screen?.orientation?.type) {
        isLandscape = window.screen.orientation.type.includes('landscape');
      } else if (typeof window.orientation !== 'undefined') {
        // Fallback for older iOS Safari
        isLandscape = Math.abs(Number(window.orientation)) === 90;
      } else {
        // Fallback to window dimensions
        isLandscape = window.innerWidth > window.innerHeight;
      }
      setDeviceIsLandscape(isLandscape);
    };

    checkOrientation();

    // Modern screen orientation API
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }

    // Window resize & orientation events
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // CSS matchMedia orientation listener
    const mql = window.matchMedia('(orientation: landscape)');
    const handleMqlChange = (e: MediaQueryListEvent) => {
      setDeviceIsLandscape(e.matches);
    };
    try {
      mql.addEventListener('change', handleMqlChange);
    } catch {
      mql.addListener(handleMqlChange);
    }

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      try {
        mql.removeEventListener('change', handleMqlChange);
      } catch {
        mql.removeListener(handleMqlChange);
      }
    };
  }, []);

  // Keyboard typing detection & URL synchronization & ESC logout
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
      syncAuthState();
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('focus', handleLocationChange);

    // Periodic check in case iframe address was updated
    const interval = setInterval(() => {
      if (checkIsAdminRoute() && !isAdminRoute) {
        setIsAdminRoute(true);
      }
      syncAuthState();
    }, 500);

    // Global keystroke listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Primary Hotkey: Ctrl + Shift + A (or Cmd + Shift + A on macOS) -> Go directly to Login / Admin screen
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isKeyA = e.code === 'KeyA' || e.key.toLowerCase() === 'a' || e.key === 'ㅁ';

      if (isCtrlOrCmd && e.shiftKey && isKeyA) {
        e.preventDefault();
        e.stopPropagation();
        setShowCommandPrompt(false);
        setQrModal(null);
        navigateTo('/admin');
        showToast('관리자 로그인 화면으로 이동합니다. (Ctrl+Shift+A)');
        return;
      }

      // If user presses ESC:
      if (e.key === 'Escape') {
        setQrModal((currentModal) => {
          if (currentModal) return null;
          return null;
        });
        if (showCommandPrompt) {
          setShowCommandPrompt(false);
          return;
        }

        // Check if currently logged in and on the main screen
        const wasLoggedIn = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
        if (wasLoggedIn) {
          e.preventDefault();
          handleLogout();
          return;
        }
      }

      // If user is currently typing in an input or textarea, let it be
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      // If user presses '/' on the page, open the HUD command prompt
      if (e.key === '/') {
        e.preventDefault();
        setShowCommandPrompt(true);
        setCommandInput('/admin');
        setTimeout(() => {
          commandInputRef.current?.focus();
          commandInputRef.current?.select();
        }, 50);
        return;
      }

      // Buffer last typed characters
      if (e.key && e.key.length === 1) {
        keySequenceRef.current = (keySequenceRef.current + e.key.toLowerCase()).slice(-15);
      }

      const seq = keySequenceRef.current;
      // Match /admin, admin, or Korean keyboard equivalents (/ㅁㄻㅑㅜ, ㅁㄻㅑㅜ)
      if (
        seq.endsWith('/admin') ||
        seq.endsWith('admin') ||
        seq.endsWith('/ㅁㄻㅑㅜ') ||
        seq.endsWith('ㅁㄻㅑㅜ')
      ) {
        keySequenceRef.current = '';
        setShowCommandPrompt(false);
        navigateTo('/admin');
        return;
      }

      // Fallback Hotkey Alt+A
      if (e.altKey && (e.code === 'KeyA' || e.key.toLowerCase() === 'a' || e.key === 'ㅁ')) {
        e.preventDefault();
        navigateTo(isAdminRoute ? '/' : '/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('focus', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [isAdminRoute, showCommandPrompt]);

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanCmd = commandInput.trim().toLowerCase();
    if (cleanCmd === '/admin' || cleanCmd === 'admin' || cleanCmd.includes('admin')) {
      setShowCommandPrompt(false);
      setCommandInput('');
      navigateTo('/admin');
    } else {
      showToast(`알 수 없는 명령어: "${commandInput}". "/admin"을 입력해주세요.`);
    }
  };

  const handleSaveStudentData = (updated: StudentData) => {
    setStudent(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage error
    }
    showToast(language === 'ko' ? '프로필 정보가 저장되었습니다.' : 'Profile information saved.');
  };

  // If in /admin route, display the full admin configuration dashboard
  if (isAdminRoute) {
    return (
      <>
        <AdminPage
          student={student}
          onSave={handleSaveStudentData}
          onExit={() => navigateTo('/')}
          lang={language}
          onLanguageChange={handleLanguageChange}
        />
        <Toast message={toastMessage} isVisible={toastVisible} />
      </>
    );
  }

  // Main screen: Pure digital ID card with ESC logout handling
  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 font-sans flex flex-col items-center justify-center p-3 sm:p-6 circuit-bg relative overflow-x-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-teal-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-sky-950/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header: Language Selector */}
      <header className="fixed top-2.5 right-2.5 sm:top-4 sm:right-6 z-50">
        <LanguageToggle
          currentLang={language}
          onLanguageChange={handleLanguageChange}
        />
      </header>

      {/* Top Floating Admin Status Bar when logged in */}
      {isAdminLoggedIn && (
        <aside
          aria-label="관리자 로그인 상태 알림"
          className="fixed top-2 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
        >
          <div className="px-4 py-2 rounded-2xl bg-[#09152a]/95 backdrop-blur-md border border-teal-400/60 shadow-[0_0_25px_rgba(0,229,192,0.22)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5c0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5c0]" />
              </span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-bold text-teal-300 text-[11px] tracking-wider uppercase">
                    ADMIN AUTHENTICATED
                  </span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded border border-teal-500/40">
                    CLASS-A
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 truncate hidden sm:inline">
                  {t.adminLoggedBanner}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('/admin')}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-mono-code text-[11px] transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.editButton}</span>
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 font-mono-code text-[11px] border border-slate-700/80 hover:border-rose-500/40 transition cursor-pointer"
                title="단축키 ESC를 눌러도 로그아웃됩니다"
              >
                <span>{t.logoutButton}</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* The Single Screen Card Stage (Adapts dynamically to Portrait & Landscape) */}
      <main
        className={`w-full flex flex-col items-center justify-center py-2 z-10 ${
          isCardLandscape ? 'pt-12 sm:pt-14' : 'pt-14 sm:pt-16'
        }`}
      >
        {isCardLandscape ? (
          <HorizontalCard
            student={student}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((prev) => !prev)}
            onAdminTrigger={() => navigateTo('/admin')}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenQrModal={(data) => setQrModal(data)}
            lang={language}
          />
        ) : (
          <VerticalCr80Card
            student={student}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((prev) => !prev)}
            onAdminTrigger={() => navigateTo('/admin')}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenQrModal={(data) => setQrModal(data)}
            lang={language}
          />
        )}

        {/* Discreet HUD Admin info & ESC Logout status */}
        {isAdminLoggedIn && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo('/admin')}
              className="text-[11px] font-mono-code text-teal-300 hover:text-teal-200 transition flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/40 shadow-sm cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c0] pulse-dot" />
              <span>{t.adminAuthActive}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-mono-code text-slate-400 hover:text-rose-300 transition flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 shadow-sm cursor-pointer"
              title="단축키 ESC로도 로그아웃할 수 있습니다"
            >
              <span>{t.logoutButton}</span>
            </button>
          </div>
        )}
      </main>

      {/* Popup HUD Command Bar when user presses '/' */}
      {showCommandPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md p-4 rounded-2xl bg-[#081222] border border-teal-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code text-teal-400 font-bold tracking-wider">
                COMMAND TERMINAL
              </span>
              <button
                type="button"
                onClick={() => setShowCommandPrompt(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.close} (Esc)</span>
              </button>
            </div>
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code text-teal-400 text-xs font-bold">
                  &gt;_
                </span>
                <input
                  ref={commandInputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowCommandPrompt(false);
                  }}
                  placeholder={language === 'ko' ? '/admin 입력 후 Enter' : 'Type /admin and press Enter'}
                  className="w-full bg-slate-950 border border-teal-500/40 focus:border-teal-300 rounded-xl pl-8 pr-3 py-2.5 text-xs font-mono-code text-teal-200 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono-code text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {language === 'ko' ? '실행' : 'Run'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Notification Toast */}
      <Toast message={toastMessage} isVisible={toastVisible} />

      {/* Global High-Resolution QR Code Modal */}
      {qrModal && (
        <QrCodeModal
          isOpen={qrModal.isOpen}
          onClose={() => setQrModal(null)}
          title={qrModal.title}
          subtitle={qrModal.subtitle}
          url={qrModal.url}
          iconType={qrModal.iconType}
          lang={language}
        />
      )}
    </div>
  );
}
