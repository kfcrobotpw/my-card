import { X, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  onCopy: () => void;
}

export default function ShareModal({ isOpen, onClose, url, onCopy }: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="share-modal"
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-slate-900 border border-teal-500/30 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-teal-400 font-display font-bold text-sm">
            <Share2 className="w-4 h-4" />
            <span>프로필 링크 공유</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          현재 브라우저에서는 기본 공유창 대신 링크 복사로 바로 전달할 수 있습니다. 아래 주소를 복사해 전달하세요.
        </p>

        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800">
          <input
            type="text"
            id="share-modal-url-input"
            readOnly
            value={url}
            className="bg-transparent text-xs text-teal-300 font-mono-code flex-1 px-2 py-1 outline-none truncate"
          />
          <button
            type="button"
            onClick={onCopy}
            className="px-3 py-1.5 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition"
          >
            복사
          </button>
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
