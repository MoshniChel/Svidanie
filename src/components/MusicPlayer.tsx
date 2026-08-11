import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Volume1, Music, Play, Pause } from "lucide-react";

const PRIMARY_AUDIO = "/Kalym_cutted.mp3";

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
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy until user interacts or source loading
          });
      }
    };

    // Try playing immediately on mount
    playAudio();

    // Trigger play on any initial user interaction if blocked initially
    const handleUserGesture = () => {
      playAudio();
    };

    const events = ["click", "touchstart", "pointerdown", "keydown", "scroll"];
    events.forEach((evt) =>
      window.addEventListener(evt, handleUserGesture, { once: true, capture: true })
    );

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, handleUserGesture, { capture: true })
      );
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
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-2">
      {/* HTML5 Audio Element playing local Kalym.mp3 in loop */}
      <audio
        ref={audioRef}
        src={PRIMARY_AUDIO}
        loop
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Compact Audio Control Pill */}
      <div
        id="music-player-pill"
        className="bg-white/95 backdrop-blur-md border-3 border-[#FF4D6D] shadow-2xl rounded-full px-3 py-2 sm:px-3.5 sm:py-2 flex items-center gap-2 sm:gap-2.5 text-[#590D22] transition-all hover:scale-102"
      >
        {/* Animated Music Icon */}
        <div
          className={`p-2 rounded-full transition-colors ${
            isPlaying ? "bg-[#FF4D6D] text-white animate-pulse" : "bg-[#FFB3C1] text-[#590D22]"
          }`}
        >
          <Music className="w-4 h-4" />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-[#FF4D6D] hover:bg-[#FF758F] text-white transition-all cursor-pointer shadow-md flex items-center justify-center active:scale-95 shrink-0"
          title={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-1.5 bg-[#FFF0F3] px-2.5 py-1 rounded-full border border-[#FFB3C1]">
          <button
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-[#FFB3C1]/50 text-[#800F2F] transition-colors cursor-pointer shrink-0"
            title={isMuted ? "Включить звук" : "Выключить звук"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-14 sm:w-20 h-1.5 bg-[#FFB3C1] rounded-lg appearance-none cursor-pointer accent-[#FF4D6D] focus:outline-none"
            title={`Громкость: ${isMuted ? 0 : volume}%`}
          />
        </div>
      </div>
    </div>
  );
};
