import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import celebrationImg from "../assets/images/celebration_love_1786337857701.jpg";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="w-full max-w-md bg-white rounded-[40px] p-6 sm:p-8 border-4 border-[#FF4D6D] shadow-2xl relative overflow-hidden text-center my-8"
      >
        {/* Animated Badge */}
        <div className="w-20 h-20 bg-[#FFF0F3] text-[#FF4D6D] rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-[#FF758F] shadow-md animate-bounce">
          <PartyPopper className="w-10 h-10" />
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-[#590D22] tracking-tight mb-4 uppercase">
          УРААА! 🎉💕
        </h2>

        {/* Cat Meme Image */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6 relative rounded-3xl overflow-hidden border-4 border-[#FF4D6D] shadow-xl transform -rotate-2 hover:rotate-0 transition-transform">
          <img
            src={celebrationImg}
            alt="Праздничный котик"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 px-6 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-black text-lg sm:text-xl rounded-full shadow-[0_6px_0_0_#A4133C] active:translate-y-1 active:shadow-[0_2px_0_0_#A4133C] transition-all cursor-pointer"
        >
          УРААА! 💕
        </button>
      </motion.div>
    </div>
  );
};
