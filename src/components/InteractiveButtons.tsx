import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Heart, CheckCircle2, Sparkles } from "lucide-react";
import { RUNAWAY_PHRASES } from "../data/defaults";

interface InteractiveButtonsProps {
  onAccept: () => void;
  isLoading: boolean;
}

export const InteractiveButtons: React.FC<InteractiveButtonsProps> = ({
  onAccept,
  isLoading,
}) => {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic scale for YES button as NO button is dodged
  const yesScale = Math.min(1 + noCount * 0.12, 1.7);

  const moveNoButton = () => {
    if (noCount >= 10) return;
    if (!containerRef.current) return;
    
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    const randomX = (Math.random() - 0.5) * 520;
    const randomY = (Math.random() - 0.5) * 280;
    setNoPosition({ x: randomX, y: randomY });
    setHasMoved(true);
  };

  const getNoButtonText = () => {
    if (noCount >= 10) {
      return "Полюбому 💕";
    }
    return RUNAWAY_PHRASES[noCount];
  };

  const handleNoAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (noCount >= 10) {
      onAccept();
    } else {
      moveNoButton();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-white/90 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border-4 border-[#FF4D6D] shadow-2xl text-center relative min-h-[240px] flex flex-col items-center justify-center transform sm:rotate-1 z-20"
    >
      <h3 className="text-2xl sm:text-3xl font-black text-[#590D22] mb-2 flex items-center justify-center gap-2">
        <span>Ну что, идем?</span>
        <Heart className="w-7 h-7 text-[#FF4D6D] fill-[#FF4D6D] animate-bounce" />
      </h3>
      <p className="text-xs sm:text-sm text-[#800F2F] font-medium mb-6">
        {noCount === 0
          ? "Сделай правильный выбор (подсказка: кнопка 'ДА' приносит счастье) ✨"
          : `Попыток нажатия на 'НЕТ': ${noCount} 🤭`}
      </p>

      {/* Buttons Container */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[90px] w-full relative">
        {/* YES BUTTON */}
        <motion.button
          type="button"
          disabled={isLoading}
          style={{ transform: `scale(${yesScale})` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={onAccept}
          className="px-8 sm:px-10 py-4 sm:py-5 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-black text-xl sm:text-2xl rounded-full shadow-[0_8px_0_0_#A4133C] active:translate-y-1 active:shadow-[0_2px_0_0_#A4133C] flex items-center gap-3 transition-all cursor-pointer z-10 relative"
        >
          {isLoading ? (
            <Sparkles className="w-7 h-7 animate-spin" />
          ) : (
            <CheckCircle2 className="w-7 h-7 text-white" />
          )}
          <span>ДА! Я согласна! 🎉</span>
        </motion.button>

        {/* RUNAWAY NO BUTTON */}
        <motion.button
          type="button"
          animate={hasMoved ? { x: noPosition.x, y: noPosition.y } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseEnter={moveNoButton}
          onTouchStart={handleNoAction}
          onClick={handleNoAction}
          className={`px-6 py-3.5 font-extrabold text-sm rounded-full border-2 transition-all select-none cursor-pointer z-40 relative shadow-xl ${
            noCount >= 10
              ? "bg-[#FF4D6D] text-white border-[#A4133C] shadow-lg animate-pulse"
              : "bg-[#FFF0F3] hover:bg-[#FFB3C1]/50 text-[#590D22] border-[#FF758F]"
          }`}
        >
          {getNoButtonText()}
        </motion.button>
      </div>

      {noCount > 2 && (
        <p className="text-xs text-[#FF4D6D] font-black mt-5 animate-fade-in uppercase tracking-wider">
          💡 Лайфхак: чем больше пытаешься нажать "Нет", тем скорее согласишься!
        </p>
      )}
    </div>
  );
};
