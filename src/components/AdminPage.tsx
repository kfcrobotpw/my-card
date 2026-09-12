import { FormEvent, useState, useEffect } from 'react';
import { Lock, AlertTriangle, Image as ImageIcon, User, Building2, Link2, Check, Save } from 'lucide-react';
import { ADMIN_PASSWORD, DEFAULT_STUDENT_DATA, Language, SESSION_AUTH_KEY, StudentData } from '../types';
import VerticalCr80Card from './VerticalCr80Card';
import LanguageToggle from './LanguageToggle';

interface AdminPageProps {
  student: StudentData;
  onSave: (updated: StudentData) => void;
  onExit: () => void;
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const PRESET_AVATARS = [
  { label: '기본 로봇 그래픽 (기본값)', url: '' },
  { label: 'AI 로봇 파일럿 그래픽', url: '/robot_pilot_avatar.jpg' },
  {
    label: '로봇 파일럿 1',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: '로봇 파일럿 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    label: '메카닉 파일럿',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=240&auto=format&fit=crop&q=80',
  },
];

export default function AdminPage({
  student,
  onSave,
  onExit,
  lang = 'ko',
  onLanguageChange,
}: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [inputPassword, setInputPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<StudentData>(student);
  const [previewFlipped, setPreviewFlipped] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
      try {
        sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      } catch {
        // ignore session storage error
      }
    } else {
      setPasswordError('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
      setInputPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPassword('');
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      onExit();
    }, 600);
  };

  const handleReset = () => {
    if (window.confirm('모든 프로필 정보를 기본 데이터로 초기화하시겠습니까?')) {
      setFormData(DEFAULT_STUDENT_DATA);
      onSave(DEFAULT_STUDENT_DATA);
    }
  };

  // 1. Password Protection Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#040810] text-slate-100 font-sans flex flex-col items-center justify-center p-4 circuit-bg relative selection:bg-teal-500 selection:text-slate-950">
        {/* Background Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-teal-950/25 rounded-full blur-[140px]" />
        </div>

        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#081120]/90 backdrop-blur-xl border border-teal-500/30 shadow-[0_0_50px_rgba(0,229,192,0.12)] relative">
          {/* Header icon badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-lg glow-teal mb-3">
              <Lock className="w-7 h-7 text-teal-300" />
            </div>
            <div className="text-[10px] font-mono-code text-teal-400 font-semibold tracking-widest uppercase mb-1">
              SECURITY CLEARANCE // CLASS-A
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              관리자 로그인
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              로봇 파일럿 프로필 및 링크 수정을 위해 관리자 비밀번호를 입력해주세요.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-teal-300">
                단축키: <kbd className="font-bold">Ctrl + Shift + A</kbd>
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-400">
                돌아가기: <kbd className="font-bold">ESC</kbd>
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-mono-code font-semibold text-slate-300 mb-1.5"
              >
                ADMIN ACCESS KEY
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full bg-[#050b16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-3 text-slate-200 text-sm font-mono-code focus:outline-none transition pr-11 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-300 text-xs px-1.5 py-1 rounded transition"
                  title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? '숨김' : '보기'}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-xs font-mono-code text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>로그인 및 프로필 수정</span>
              <span>→</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-teal-300 transition flex items-center gap-1.5 font-mono-code"
            >
              <span>←</span>
              <span>메인 디지털 ID 카드로 돌아가기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Screen
  return (
    <div className="min-h-screen w-full bg-[#050b16] text-slate-100 font-sans p-4 sm:p-8">
      {/* Top Admin Navigation Bar */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-500/20 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/40 flex items-center justify-center text-teal-300 font-mono-code font-bold text-sm">
            /A
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>로봇 파일럿 프로필 관리자</span>
              <span className="text-[11px] font-mono-code bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                인증됨
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              카드에 표기되는 텍스트, 이미지 핫링크 URL, 링크 및 QR 코드 정보를 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onLanguageChange && (
            <LanguageToggle
              currentLang={lang}
              onLanguageChange={onLanguageChange}
            />
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-medium transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>로그아웃</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-medium transition shadow-sm hover:border-teal-400 cursor-pointer"
          >
            <span>← 메인 카드로 돌아가기</span>
          </button>
        </div>
      </header>

      {/* Main Form & Live Preview Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Section: Image Hotlink */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="avatar-url-input" className="text-sm font-bold text-teal-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-400" />
                <span>프로필 사진 핫링크 URL (Avatar Hotlink)</span>
              </label>
              <span className="text-[10px] text-teal-400/80 font-mono-code">HTTPS 이미지 URL</span>
            </div>
            <p className="text-xs text-slate-400">
              웹 상에 업로드된 사진 링크(HTTPS)를 입력하면 카드 정면의 아바타 프레임에 핫링크되어 즉시 노출됩니다.
            </p>
            <div className="flex items-center gap-2">
              <input
                id="avatar-url-input"
                type="url"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg (비우면 기본 로봇 그래픽)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono-code text-xs focus:outline-none focus:border-teal-400"
              />
              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono-code text-xs"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Quick Avatar Presets */}
            <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 shrink-0">추천 프리셋:</span>
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition border shrink-0 ${
                    formData.avatarUrl === preset.url
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Name & Identity */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              <span>파일럿 인적 사항 (Identity)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="name-input" className="block text-xs font-medium text-slate-400 mb-1">
                  이름 (한글)
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label htmlFor="name-en-input" className="block text-xs font-medium text-slate-400 mb-1">
                  영문 이름 (ENGLISH NAME)
                </label>
                <input
                  id="name-en-input"
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm font-mono-code focus:outline-none focus:border-teal-400 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="role-input" className="block text-xs font-medium text-slate-400 mb-1">
                  역할 (ROLE - 한글)
                </label>
                <input
                  id="role-input"
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm font-mono-code focus:outline-none focus:border-teal-400 uppercase"
                />
              </div>

              <div>
                <label htmlFor="role-en-input" className="block text-xs font-medium text-slate-400 mb-1">
                  역할 영문 (ROLE - ENGLISH)
                </label>
                <input
                  id="role-en-input"
                  type="text"
                  value={formData.roleEn || ''}
                  placeholder="ROBOT CREATOR & PILOT"
                  onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm font-mono-code focus:outline-none focus:border-teal-400 uppercase"
                />
              </div>

              <div>
                <label htmlFor="member-id-input" className="block text-xs font-medium text-slate-400 mb-1">
                  멤버 ID / 보안 코드 (SECURITY ID)
                </label>
                <input
                  id="member-id-input"
                  type="text"
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm font-mono-code focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Affiliation & Team */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>소속 및 팀 정보 (Affiliation & Team)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="org-input" className="block text-xs font-medium text-slate-400 mb-1">
                  소속 (AFFILIATION)
                </label>
                <input
                  id="org-input"
                  type="text"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label htmlFor="team-input" className="block text-xs font-medium text-slate-400 mb-1">
                  팀 구분 (TEAM DIVISION)
                </label>
                <input
                  id="team-input"
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="bio-input" className="block text-xs font-medium text-slate-400 mb-1">
                  한 줄 소개 (BIO STATEMENT - 한글)
                </label>
                <textarea
                  id="bio-input"
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div>
                <label htmlFor="bio-en-input" className="block text-xs font-medium text-slate-400 mb-1">
                  한 줄 소개 영문 (BIO STATEMENT - ENGLISH)
                </label>
                <textarea
                  id="bio-en-input"
                  rows={2}
                  value={formData.bioEn || ''}
                  placeholder="Bringing imagined robots to life through code."
                  onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm font-mono-code focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Links & QR Target */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-teal-400" />
              <span>온라인 링크 & 뒷면 QR 연동</span>
            </h2>

            <div>
              <label htmlFor="portfolio-input" className="block text-xs font-medium text-slate-400 mb-1">
                포트폴리오 주소 (뒷면 QR 코드 연동 URL)
              </label>
              <input
                id="portfolio-input"
                type="url"
                value={formData.links.portfolio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, portfolio: e.target.value },
                    qrTarget: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono-code focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="youtube-input" className="block text-xs font-medium text-slate-400 mb-1">
                YouTube 비디오 / 채널 주소
              </label>
              <input
                id="youtube-input"
                type="url"
                value={formData.links.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, youtube: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono-code focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>저장 완료!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>저장하고 메인 카드로 이동</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-xs font-mono-code transition cursor-pointer"
            >
              기본값 복원
            </button>
          </div>
        </form>

        {/* Right Column: Real-time Live Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono-code text-teal-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00e5c0] pulse-dot" />
              <span>실시간 카드 미리보기</span>
            </span>
            <span className="text-[11px] text-slate-400">카드를 클릭하면 회전합니다</span>
          </div>

          <div className="w-full flex justify-center scale-95 origin-top">
            <VerticalCr80Card
              student={formData}
              isFlipped={previewFlipped}
              onFlip={() => setPreviewFlipped((prev) => !prev)}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
