import React from "react";
import { Heart, Settings, Sparkles, Share2 } from "lucide-react";

interface HeaderProps {
  herName: string;
  senderName: string;
  onOpenSettings: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  herName,
  senderName,
  onOpenSettings,
  onCopyLink,
  copied,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-600 flex items-center justify-center font-bold text-xl shadow-sm border border-pink-200">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 flex items-center gap-1">
            Приглашение <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-5-00 text-slate-500">
            Для <span className="font-semibold text-pink-600">{herName}</span> от <span className="font-semibold text-rose-600">{senderName}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full border border-pink-200 transition-colors cursor-pointer"
          title="Скопировать ссылку для отправки"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? "Ссылка скопирована! ✨" : "Поделиться"}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Настроить детали приглашения"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
