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
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Calculate dynamic scale for YES button as NO button is dodged
  const yesScale = Math.min(1 + noCount * 0.12, 1.7);

  const moveNoButton = () => {
    if (noCount >= 10) return;
    
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    if (nextCount >= 10) {
      setNoPosition({ x: 0, y: 0 });
      return;
    }

    if (!noButtonRef.current || !yesButtonRef.current) return;

    const noRect = noButtonRef.current.getBoundingClientRect();
    const yesRect = yesButtonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    // Current initial top-left of NO button (without transform offset)
    const initialNoLeft = noRect.left - noPosition.x;
    const initialNoTop = noRect.top - noPosition.y;

    const noWidth = noRect.width || 120;
    const noHeight = noRect.height || 44;

    // Padding from screen edges
    const padding = 16;

    let minX = padding;
    let maxX = window.innerWidth - noWidth - padding;
    let minY = padding;
    let maxY = window.innerHeight - noHeight - padding;

    if (containerRect) {
      // Keep inside container bounds if space allows
      const cMinX = Math.max(padding, containerRect.left + padding);
      const cMaxX = Math.min(window.innerWidth - noWidth - padding, containerRect.right - noWidth - padding);
      const cMinY = Math.max(padding, containerRect.top + padding);
      const cMaxY = Math.min(window.innerHeight - noHeight - padding, containerRect.bottom - noHeight - padding);

      if (cMaxX > cMinX) {
        minX = cMinX;
        maxX = cMaxX;
      }
      if (cMaxY > cMinY) {
        minY = cMinY;
        maxY = cMaxY;
      }
    }

    // Safety checks for boundaries
    if (maxX < minX) {
      minX = padding;
      maxX = Math.max(padding, window.innerWidth - noWidth - padding);
    }
    if (maxY < minY) {
      minY = padding;
      maxY = Math.max(padding, window.innerHeight - noHeight - padding);
    }

    const gap = 20; // 20px clearance gap from YES button

    let bestX = 0;
    let bestY = 0;
    let maxDistSq = -1;

    // Sample candidate positions to guarantee non-overlap and in-bounds
    for (let i = 0; i < 100; i++) {
      const candLeft = minX + (maxX > minX ? Math.random() * (maxX - minX) : 0);
      const candTop = minY + (maxY > minY ? Math.random() * (maxY - minY) : 0);

      // Check overlap with YES button
      const overlapsYes =
        candLeft - gap < yesRect.right &&
        candLeft + noWidth + gap > yesRect.left &&
        candTop - gap < yesRect.bottom &&
        candTop + noHeight + gap > yesRect.top;

      if (!overlapsYes) {
        bestX = candLeft - initialNoLeft;
        bestY = candTop - initialNoTop;
        break;
      }

      // Track furthest position as fallback
      const noCenterX = candLeft + noWidth / 2;
      const noCenterY = candTop + noHeight / 2;
      const yesCenterX = yesRect.left + yesRect.width / 2;
      const yesCenterY = yesRect.top + yesRect.height / 2;
      const distSq = (noCenterX - yesCenterX) ** 2 + (noCenterY - yesCenterY) ** 2;

      if (distSq > maxDistSq) {
        maxDistSq = distSq;
        bestX = candLeft - initialNoLeft;
        bestY = candTop - initialNoTop;
      }
    }

    setNoPosition({ x: bestX, y: bestY });
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
          ref={yesButtonRef}
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
          ref={noButtonRef}
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
