import React from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, Star } from "lucide-react";
import heroImg from "../assets/images/TomWFlowers.png";

interface HeroCardProps {
  herName: string;
  senderName: string;
  customMessage: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  herName,
  senderName,
  customMessage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 backdrop-blur-md rounded-[28px] sm:rounded-[40px] p-5 sm:p-8 border-3 sm:border-4 border-[#FF4D6D] shadow-xl sm:shadow-2xl relative overflow-hidden text-center transform sm:-rotate-1 transition-transform hover:rotate-0"
    >
      {/* Decorative background blurs */}
      <div className="absolute -top-12 -left-12 w-32 sm:w-36 h-32 sm:h-36 bg-[#FFB3C1]/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 sm:w-36 h-32 sm:h-36 bg-[#FF4D6D]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Cute Badge */}
      <div className="bg-[#FF4D6D] text-white px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black tracking-wider uppercase mb-3.5 transform -rotate-1 sm:-rotate-2 shadow-md inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-[#A4133C]">
        <Sparkles className="w-3.5 h-3.5 text-pink-200 shrink-0" />
        <span className="truncate">Газ на свидание со мной ❤️</span>
        <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 shrink-0" />
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#590D22] tracking-tight mb-2.5 leading-tight">
        Королева <span className="text-[#FF4D6D] underline decoration-[#FF85A1] underline-offset-4">{herName}</span>! 💕
      </h2>

      <p className="text-[#800F2F] font-serif italic text-sm sm:text-lg max-w-xl mx-auto mb-5 leading-relaxed px-1">
        Знаешь почему ты должна пойти на свидание со мной? Я играю в шахматы и знаю как защитить свою Королеву 😉
      </p>

      {/* Cute Cat Illustration with bold playful rotation */}
      <div className="relative w-36 h-36 sm:w-52 sm:h-52 mx-auto mb-5 group">
        <div className="absolute inset-0 bg-[#FF4D6D] rounded-3xl rotate-4 sm:rotate-6 group-hover:rotate-12 transition-transform opacity-80" />
        <img
          src={heroImg}
          alt="Том с цветами"
          referrerPolicy="no-referrer"
          className="relative w-full h-full object-cover rounded-3xl shadow-xl border-3 sm:border-4 border-white -rotate-2 sm:-rotate-3 group-hover:rotate-0 transition-transform duration-300"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -top-2.5 -right-2.5 bg-white p-2 sm:p-2.5 rounded-full shadow-lg border-2 border-[#FF4D6D] text-[#FF4D6D]"
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FF4D6D] text-[#FF4D6D]" />
        </motion.div>
      </div>

      {/* Sweet Personal Message Box (renders only if custom message provided) */}
      {customMessage && customMessage.trim() !== "" && (
        <div className="bg-[#FFF0F3] rounded-2xl p-4 sm:p-5 border-2 border-[#FF758F] max-w-lg mx-auto text-[#590D22] text-xs sm:text-base leading-relaxed relative shadow-inner">
          <p className="font-serif italic text-sm sm:text-base">"{customMessage}"</p>
          <span className="block text-right text-[11px] sm:text-xs font-black text-[#FF4D6D] uppercase tracking-wider mt-2.5">
            — С заботой, {senderName} 💌
          </span>
        </div>
      )}
    </motion.div>
  );
};
