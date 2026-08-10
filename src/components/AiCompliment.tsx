import React, { useState } from "react";
import { Sparkles, RefreshCw, Quote } from "lucide-react";

interface AiComplimentProps {
  herName: string;
}

export const AiCompliment: React.FC<AiComplimentProps> = ({ herName }) => {
  const [compliment, setCompliment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCompliment = async (type: "compliment" | "reason") => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-ai-compliment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: herName, promptType: type }),
      });
      const data = await res.json();
      setCompliment(data.text || "Ты невероятно прекрасна!");
    } catch (e) {
      setCompliment(`Ученые доказали: улыбка ${herName} делает этот мир лучше на 100%! 💕`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white/90 rounded-[28px] p-5 sm:p-6 border-3 border-[#FF4D6D] shadow-lg text-center">
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-[#FF4D6D] uppercase tracking-wider mb-3">
        <Sparkles className="w-4 h-4 text-[#FF4D6D] animate-spin-slow" />
        <span>Генератор 100% честных комплиментов</span>
      </div>

      {compliment ? (
        <div className="bg-[#FFF0F3] rounded-2xl p-4 border-2 border-[#FF758F] text-[#590D22] text-sm sm:text-base font-serif italic my-3 relative shadow-inner">
          <Quote className="w-5 h-5 text-[#FF758F] absolute -top-2.5 -left-2 rotate-180 fill-[#FFB3C1]" />
          <p className="px-3 py-1">"{compliment}"</p>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-[#800F2F] font-medium mb-4">
          Нужен ещё один повод нажать кнопку «ДА»? Сгенерируй персональный комплимент!
        </p>
      )}

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          type="button"
          disabled={loading}
          onClick={() => fetchCompliment("compliment")}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-[#FFF0F3] hover:bg-[#FFB3C1]/50 text-[#590D22] rounded-full border-2 border-[#FF758F] transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#FF4D6D]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#FF4D6D]" />
          )}
          <span>{compliment ? "Ещё комплимент ✨" : "Сгенерировать комплимент ✨"}</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => fetchCompliment("reason")}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-[#FF4D6D] hover:bg-[#ff3358] text-white rounded-full border-2 border-[#A4133C] shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span>Причина сказать ДА 💡</span>
        </button>
      </div>
    </div>
  );
};
