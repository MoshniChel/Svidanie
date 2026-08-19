import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import celebrationImg from "../assets/images/Shocked.jpg";

interface SuccessModalProps {
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#FF4D6D", "#FF85A1", "#FFB3C1", "#FF0054"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#FF4D6D", "#FF85A1", "#FFB3C1", "#FF0054"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="w-full max-w-sm sm:max-w-md bg-white rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 border-3 sm:border-4 border-[#FF4D6D] shadow-2xl relative overflow-hidden text-center my-auto max-h-[92vh] flex flex-col justify-between"
      >
        <div>
          {/* Animated Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFF0F3] text-[#FF4D6D] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 sm:border-3 border-[#FF758F] shadow-md animate-bounce">
            <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          {/* Big Headline */}
          <h2 className="text-xl sm:text-3xl font-black text-[#590D22] tracking-tight mb-3 sm:mb-4 leading-tight">
            УРААА! Да ну, я ждал этого 10 тысяч лет 🎉💕
          </h2>

          {/* Celebration Image */}
          <div className="w-44 h-44 sm:w-64 sm:h-64 mx-auto mb-5 sm:mb-6 relative rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-[#FF4D6D] shadow-xl transform -rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform">
            <img
              src={celebrationImg}
              alt="Радостный кот с букетом"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 sm:py-4 px-6 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-black text-base sm:text-xl rounded-full shadow-[0_5px_0_0_#A4133C] sm:shadow-[0_6px_0_0_#A4133C] active:translate-y-1 active:shadow-[0_2px_0_0_#A4133C] transition-all cursor-pointer touch-manipulation min-h-[48px]"
        >
          Подтверждаю 💕
        </button>
      </motion.div>
    </div>
  );
};
