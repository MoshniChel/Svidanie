import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, CheckCircle2, Sparkles } from "lucide-react";
import { RUNAWAY_PHRASES } from "../data/defaults";

interface InteractiveButtonsProps {
  onAccept: (noCount: number) => void;
  isLoading: boolean;
}

export const InteractiveButtons: React.FC<InteractiveButtonsProps> = ({
  onAccept,
  isLoading,
}) => {
  const [noCount, setNoCount] = useState(0);

  // Dynamic sizing that scales beautifully on both mobile and desktop screens
  // without clipping or causing horizontal viewport overflows
  const growthScale = 1 + noCount * 0.08;
  const paddingY = Math.min(14 + noCount * 3.5, 34);
  const paddingX = Math.min(20 + noCount * 5, 48);
  const fontSize = Math.min(15 + noCount * 1.6, 26);
  const iconSize = Math.min(20 + noCount * 1.6, 30);

  const getNoButtonText = () => {
    if (noCount >= RUNAWAY_PHRASES.length - 1) {
      return RUNAWAY_PHRASES[RUNAWAY_PHRASES.length - 1];
    }
    return RUNAWAY_PHRASES[noCount];
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (noCount >= RUNAWAY_PHRASES.length - 1) {
      onAccept(noCount);
    } else {
      setNoCount((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[40px] p-4 sm:p-8 border-3 sm:border-4 border-[#FF4D6D] shadow-xl sm:shadow-2xl text-center relative flex flex-col items-center justify-center transform sm:rotate-1 z-20 transition-all duration-300 overflow-hidden">
      <h3 className="text-xl sm:text-3xl font-black text-[#590D22] mb-1 flex items-center justify-center gap-2">
        <span>Ну что, идем?</span>
        <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF4D6D] fill-[#FF4D6D] animate-bounce" />
      </h3>
      <p className="text-xs sm:text-sm text-[#800F2F] font-medium mb-3.5 sm:mb-5 px-1">
        {noCount === 0
          ? "Сделай правильный выбор (подсказка: кнопка 'ДА' приносит счастье) ✨"
          : `Попыток нажатия на 'НЕТ': ${noCount} 🤭`}
      </p>

      {/* Buttons Container - Stacked with YES on top and NO smoothly pushed downwards */}
      <motion.div
        layout
        className="flex flex-col items-center justify-center gap-3.5 sm:gap-5 w-full relative max-w-full"
      >
        {/* YES BUTTON - physically expands and pushes the NO button downwards */}
        <motion.button
          layout
          type="button"
          disabled={isLoading}
          style={{
            paddingTop: `${paddingY}px`,
            paddingBottom: `${paddingY}px`,
            paddingLeft: `${paddingX}px`,
            paddingRight: `${paddingX}px`,
            fontSize: `${fontSize}px`,
          }}
          transition={{
            layout: { type: "spring", stiffness: 280, damping: 24 },
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAccept(noCount)}
          className="max-w-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-black rounded-full shadow-[0_6px_0_0_#A4133C] sm:shadow-[0_8px_0_0_#A4133C] active:translate-y-1 active:shadow-[0_2px_0_0_#A4133C] flex items-center justify-center gap-2.5 sm:gap-3 transition-colors cursor-pointer z-10 relative select-none text-center touch-manipulation min-h-[48px] box-border"
        >
          {isLoading ? (
            <Sparkles
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              className="animate-spin shrink-0"
            />
          ) : (
            <CheckCircle2
              style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              className="text-white shrink-0"
            />
          )}
          <span className="leading-tight break-words text-center">ДА! Я согласна! 🎉</span>
        </motion.button>

        {/* NO BUTTON - placed below YES and pushed downwards smoothly as YES expands */}
        <motion.button
          layout
          type="button"
          transition={{
            layout: { type: "spring", stiffness: 280, damping: 24 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNoClick}
          className={`max-w-full px-5 sm:px-6 py-2.5 sm:py-3 font-extrabold text-xs sm:text-sm rounded-full border-2 select-none cursor-pointer z-10 relative shadow-md sm:shadow-lg transition-colors text-center touch-manipulation min-h-[40px] break-words ${
            noCount >= RUNAWAY_PHRASES.length - 1
              ? "bg-[#FF4D6D] text-white border-[#A4133C] shadow-lg animate-pulse"
              : "bg-[#FFF0F3] hover:bg-[#FFB3C1]/50 text-[#590D22] border-[#FF758F]"
          }`}
        >
          {getNoButtonText()}
        </motion.button>
      </motion.div>

      {noCount > 2 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] sm:text-xs text-[#FF4D6D] font-black mt-3 sm:mt-4 uppercase tracking-wider"
        >
          💡 Лайфхак: кнопка 'ДА' становится всё больше и больше!
        </motion.p>
      )}
    </div>
  );
};
