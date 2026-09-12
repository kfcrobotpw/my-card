import { FormEvent, useState } from 'react';
import { Settings, X, Image as ImageIcon } from 'lucide-react';
import { StudentData } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData;
  onSave: (updated: StudentData) => void;
}

// Preset photo/avatar hotlinks for easy one-click testing
const PRESET_AVATARS = [
  { label: '기본 엠블럼 (기본값)', url: '' },
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

export default function ProfileEditModal({ isOpen, onClose, student, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<StudentData>(student);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="profile-edit-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="profile-edit-modal"
        className="w-full max-w-lg rounded-2xl bg-[#091322] border border-teal-500/40 p-5 sm:p-6 shadow-2xl space-y-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/20">
          <div className="flex items-center gap-2 text-teal-400 font-display font-bold text-base">
            <Settings className="w-5 h-5 text-teal-400" />
            <span>프로필 정보 & 이미지 핫링크 설정</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Image Hotlink Section */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="avatar-url-input" className="font-tech text-teal-300 font-bold uppercase flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-300" />
                <span>프로필 사진 핫링크 URL (Hotlinked Image)</span>
              </label>
              <span className="text-[10px] text-teal-400/80 font-mono-code">HTML 직접 연동</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              웹 상의 이미지 주소(HTTPS)를 입력하면 카드 앞면 사진 슬롯에 핫링크되어 실시간 렌더링됩니다.
            </p>
            <div className="flex items-center gap-2">
              <input
                id="avatar-url-input"
                type="url"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/my-photo.jpg (비우면 기본 그래픽)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono-code text-xs focus:outline-none focus:border-teal-400"
              />
              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                  className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono-code text-[11px]"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-400 font-mono-code shrink-0">샘플:</span>
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                  className={`px-2 py-1 rounded text-[10px] font-mono-code border transition shrink-0 ${
                    formData.avatarUrl === preset.url
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Identity Fields Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                이름 (한글)
              </label>
              <input
                id="name-input"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    avatarText: e.target.value.slice(0, 2),
                  })
                }
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="name-en-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                이름 (영문)
              </label>
              <input
                id="name-en-input"
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-code focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="org-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                소속 단체 (Affiliation)
              </label>
              <input
                id="org-input"
                type="text"
                value={formData.org}
                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="team-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                팀명 (Team Division)
              </label>
              <input
                id="team-input"
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-tech focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="role-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                역할 (Role)
              </label>
              <input
                id="role-input"
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-teal-300 font-tech focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="member-id-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
                멤버 ID
              </label>
              <input
                id="member-id-input"
                type="text"
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono-code focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Bio statement */}
          <div>
            <label htmlFor="bio-input" className="block text-slate-400 font-mono-code text-[11px] mb-1">
              한 줄 소개 (Bio Statement)
            </label>
            <input
              id="bio-input"
              type="text"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Links */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <span className="block text-[11px] font-mono-code text-teal-400 font-bold uppercase">
              활동 링크 (URL)
            </span>

            <div>
              <label htmlFor="portfolio-url-input" className="block text-slate-400 font-mono-code text-[10px] mb-0.5">
                포트폴리오 URL (QR 코드 자동 연결)
              </label>
              <input
                id="portfolio-url-input"
                type="url"
                value={formData.links.portfolio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, portfolio: e.target.value },
                    qrTarget: e.target.value,
                  })
                }
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-teal-300 font-mono-code text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label htmlFor="youtube-url-input" className="block text-slate-400 font-mono-code text-[10px] mb-0.5">
                YouTube 영상 URL
              </label>
              <input
                id="youtube-url-input"
                type="url"
                value={formData.links.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    links: { ...formData.links, youtube: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono-code text-xs focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-teal-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium transition text-xs"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00e5c0] hover:bg-[#00c9a8] text-slate-950 font-bold shadow-md transition text-xs glow-teal"
            >
              저장 및 카드 반영
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
