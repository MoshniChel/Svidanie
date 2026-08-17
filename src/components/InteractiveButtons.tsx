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

  // Dynamic sizing based on how many times "НЕТ" was pressed
  const paddingY = Math.min(16 + noCount * 5, 38);
  const paddingX = Math.min(32 + noCount * 9, 68);
  const fontSize = Math.min(18 + noCount * 2.5, 32);
  const iconSize = Math.min(24 + noCount * 2.5, 38);

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
    <div className="w-full bg-white/95 backdrop-blur-md rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border-4 border-[#FF4D6D] shadow-2xl text-center relative flex flex-col items-center justify-center transform sm:rotate-1 z-20 transition-all duration-300">
      <h3 className="text-2xl sm:text-3xl font-black text-[#590D22] mb-1 flex items-center justify-center gap-2">
        <span>Ну что, идем?</span>
        <Heart className="w-7 h-7 text-[#FF4D6D] fill-[#FF4D6D] animate-bounce" />
      </h3>
      <p className="text-xs sm:text-sm text-[#800F2F] font-medium mb-5">
        {noCount === 0
          ? "Сделай правильный выбор (подсказка: кнопка 'ДА' приносит счастье) ✨"
          : `Попыток нажатия на 'НЕТ': ${noCount} 🤭`}
      </p>

      {/* Buttons Container */}
      <motion.div
        layout
        className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full relative"
      >
        {/* YES BUTTON - physically expands and pushes the NO button */}
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
            layout: { type: "spring", stiffness: 300, damping: 25 },
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAccept(noCount)}
          className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-black rounded-full shadow-[0_8px_0_0_#A4133C] active:translate-y-1 active:shadow-[0_2px_0_0_#A4133C] flex items-center justify-center gap-3 transition-colors cursor-pointer z-10 relative select-none text-center"
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
          <span className="leading-tight">ДА! Я согласна! 🎉</span>
        </motion.button>

        {/* STATIONARY NO BUTTON - pushed naturally as YES button grows */}
        <motion.button
          layout
          type="button"
          transition={{
            layout: { type: "spring", stiffness: 300, damping: 25 },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNoClick}
          className={`px-6 py-3.5 font-extrabold text-sm sm:text-base rounded-full border-2 select-none cursor-pointer z-10 relative shadow-lg transition-colors text-center ${
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
          className="text-xs text-[#FF4D6D] font-black mt-4 uppercase tracking-wider"
        >
          💡 Лайфхак: кнопка 'ДА' становится всё больше и больше!
        </motion.p>
      )}
    </div>
  );
};
