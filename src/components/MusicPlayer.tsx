import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Volume1, Music, Play, Pause } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLoaded, setIsLoaded] = useState(false);

  const playerRef = useRef<any>(null); // YouTube Player

  const START_TIME = 48; // 0:48
  const END_TIME = 78;   // 1:18

  useEffect(() => {
    let interval: any;

    const initYoutubePlayer = () => {
      if (playerRef.current || !window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player("yt-bg-player", {
          height: "1",
          width: "1",
          videoId: "qdDVtFvJwUc",
          playerVars: {
            start: START_TIME,
            end: END_TIME,
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsLoaded(true);
              try {
                event.target.setVolume(volume);
                event.target.seekTo(START_TIME, true);
                event.target.playVideo();
                setIsPlaying(true);
              } catch (e) {
                console.log("Autoplay waiting for user interaction", e);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop strictly from 0:48 when ended
                try {
                  event.target.seekTo(START_TIME, true);
                  event.target.playVideo();
                  setIsPlaying(true);
                } catch (e) {
                  console.error("Error restarting video at 0:48", e);
                }
              }
            },
          },
        });
      } catch (err) {
        console.error("YouTube Player init error:", err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initYoutubePlayer();
      };
    } else {
      initYoutubePlayer();
    }

    // Interval to strictly enforce 0:48 to 1:18 loop range
    interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const state = playerRef.current.getPlayerState?.();

          if (state === 1 && (currentTime >= END_TIME - 0.5 || currentTime < START_TIME - 1)) {
            playerRef.current.seekTo(START_TIME, true);
            playerRef.current.playVideo();
          }
        } catch (e) {
          // ignore transient call errors
        }
      }
    }, 250);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // First user interaction auto-play trigger
  useEffect(() => {
    const handleFirstClick = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === "function") {
        try {
          const state = playerRef.current.getPlayerState();
          if (state !== 1) {
            playerRef.current.seekTo(START_TIME, true);
            playerRef.current.playVideo();
            setIsPlaying(true);
          }
        } catch (err) {
          // player might not be ready
        }
      }
    };

    window.addEventListener("click", handleFirstClick, { once: true });
    return () => {
      window.removeEventListener("click", handleFirstClick);
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || !isLoaded) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime < START_TIME || currentTime >= END_TIME) {
          playerRef.current.seekTo(START_TIME, true);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Toggle play error:", e);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (!playerRef.current || !isLoaded) return;
    try {
      if (nextMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch (e) {
      console.error("Toggle mute error:", e);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);

    if (!playerRef.current || !isLoaded) return;
    try {
      playerRef.current.setVolume(newVol);
      if (newVol === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    } catch (err) {
      console.error("Set volume error:", err);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-2">
      {/* Hidden container for YouTube iframe */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        <div id="yt-bg-player" />
      </div>

      {/* Compact Audio Control Pill without title or upload button */}
      <div id="music-player-pill" className="bg-white/95 backdrop-blur-md border-3 border-[#FF4D6D] shadow-2xl rounded-full px-3 py-2 sm:px-3.5 sm:py-2 flex items-center gap-2 sm:gap-2.5 text-[#590D22] transition-all hover:scale-102">
        {/* Animated Music Icon */}
        <div className={`p-2 rounded-full transition-colors ${isPlaying ? "bg-[#FF4D6D] text-white animate-pulse" : "bg-[#FFB3C1] text-[#590D22]"}`}>
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
