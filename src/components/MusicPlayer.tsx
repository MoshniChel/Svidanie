import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Volume1, Music, Play, Pause } from "lucide-react";
import { motion } from "motion/react";

const PRIMARY_AUDIO = `${import.meta.env.BASE_URL}Kalym_cutted.mp3`;

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync volume and mute with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Attempt immediate playback & register gesture triggers for instant playback
  useEffect(() => {
    let cleanedUp = false;

    const cleanupListeners = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserGesture, true);
        document.removeEventListener(evt, handleUserGesture, true);
      });
    };

    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            cleanupListeners();
          })
          .catch(() => {
            // Autoplay blocked by browser policy until user interacts
          });
      }
    };

    // Try playing immediately on mount
    playAudio();

    // Trigger play on any initial user interaction if blocked initially
    const handleUserGesture = () => {
      playAudio();
    };

    const events = ["click", "touchstart", "pointerdown", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserGesture, true);
      document.addEventListener(evt, handleUserGesture, true);
    });

    return () => {
      cleanupListeners();
    };
  }, []);

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Play error:", err);
        });
    }
  };

  // Mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);

    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
      if (newVol === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      {/* HTML5 Audio Element playing local Kalym.mp3 in loop */}
      <audio
        ref={audioRef}
        src={PRIMARY_AUDIO}
        loop
        autoPlay
        onCanPlay={() => {
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Single Floating & Draggable Music Button Widget with Integrated Volume Control */}
      <motion.div
        drag
        dragMomentum={false}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[100] flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border-2 border-[#FF4D6D] shadow-[0_8px_25px_rgba(255,77,109,0.35)] rounded-full p-1.5 sm:px-4 sm:py-2.5 transition-all hover:shadow-[0_12px_30px_rgba(255,77,109,0.5)] cursor-grab active:cursor-grabbing touch-none select-none"
      >
        {/* Play / Pause Toggle Button */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
            isPlaying
              ? "bg-[#FF4D6D] text-white hover:bg-[#FF758F]"
              : "bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] text-white hover:scale-105"
          }`}
          title={isPlaying ? "Поставить на паузу" : "Включить музыку"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
          ) : (
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5 shrink-0" />
          )}
          <span className="whitespace-nowrap drop-shadow-sm">
            {isPlaying ? "Музыка 🎶" : "Музыка 🎵"}
          </span>
        </button>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-1 bg-[#FFF0F3] px-2 py-1 sm:px-2.5 sm:py-1 rounded-full border border-[#FFB3C1]">
          <button
            onClick={toggleMute}
            className="p-0.5 sm:p-1 rounded-full hover:bg-[#FFB3C1]/50 text-[#800F2F] transition-colors cursor-pointer shrink-0"
            title={isMuted ? "Включить звук" : "Выключить звук"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
            ) : volume < 50 ? (
              <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-10 sm:w-16 h-1.5 bg-[#FFB3C1] rounded-lg appearance-none cursor-pointer accent-[#FF4D6D] focus:outline-none"
            title={`Громкость: ${isMuted ? 0 : volume}%`}
          />
        </div>
      </motion.div>
    </>
  );
};
