import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HeroCard } from "./components/HeroCard";
import { DateDetails } from "./components/DateDetails";
import { InteractiveButtons } from "./components/InteractiveButtons";
import { SuccessModal } from "./components/SuccessModal";
import { MusicPlayer } from "./components/MusicPlayer";
import { DEFAULT_INVITATION } from "./data/defaults";
import { InvitationData, RsvpResponse } from "./types";
import { decodeInvitationFromUrl } from "./utils/calendar";
import spongebobBgImg from "./assets/images/spongebob_point_bg_1786947985320.jpg";

export default function App() {
  const [invitation, setInvitation] = useState<InvitationData>(DEFAULT_INVITATION);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingRsvp, setIsLoadingRsvp] = useState(false);
  const [_rsvpResult, setRsvpResult] = useState<RsvpResponse | null>(null);

  // Load custom invitation from URL query if available
  useEffect(() => {
    const customData = decodeInvitationFromUrl();
    if (customData) {
      setInvitation(customData);
    }
  }, []);

  const handleAccept = async (noAttempts: number = 0) => {
    setIsLoadingRsvp(true);
    // Find food names from selected IDs
    const foodNames = invitation.selectedFoodIds.map((id) => {
      const optionMap: Record<string, string> = {
        pizza: "Итальянская пицца 🍕",
        sushi: "Роллы и суши 🍣",
        pasta: "Паста & Карбонара 🍝",
        steaks: "Стейк или Бургеры 🥩",
        seafood: "Морепродукты 🦪",
        desserts: "Десерты и сладости 🍨",
        secret: "Секретное блюдо от шефа 🎁",
      };
      return optionMap[id] || id;
    });

    try {
      const res = await fetch("/api/send-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: invitation.notificationEmail,
          senderName: invitation.senderName,
          herName: invitation.herName,
          date: `${invitation.dateStr} в ${invitation.timeStr}`,
          location: invitation.locationAddress
            ? `${invitation.locationName} (${invitation.locationAddress})`
            : invitation.locationName,
          foodChoices: foodNames,
          musicChoice: invitation.selectedMusic,
          dressCode: invitation.dressCode,
          comment: invitation.comment,
          noCount: noAttempts,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRsvpResult(data);
      } else {
        throw new Error("API route not available");
      }
    } catch (e) {
      console.warn("Server endpoint not found, sending via direct client FormSubmit...", e);
      const targetEmails = Array.from(new Set(["kolyaogre@gmail.com", "podaroqus@gmail.com", ...(invitation.notificationEmail ? invitation.notificationEmail.split(",") : [])])).map(s => s.trim()).filter(Boolean);
      for (const targetEmail of targetEmails) {
        try {
          await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              _subject: `🎉 УРА! ${invitation.herName} сказала "ДА" на свидание! 💕`,
              _template: "table",
              _captcha: "false",
              "Решение": `${invitation.herName} сказала ДА! 🎉`,
              "Попыток нажать 'НЕТ'": `${noAttempts}`,
              "Выбранные блюда": foodNames.length > 0 ? foodNames.join(", ") : "Не выбрано",
              "Музыка": invitation.selectedMusic || "Не выбрано",
              "Дата и время": `${invitation.dateStr} в ${invitation.timeStr}`,
              "Место": invitation.locationAddress
                ? `${invitation.locationName} (${invitation.locationAddress})`
                : invitation.locationName,
              "Дресс-код": invitation.dressCode,
              "Пожелания": invitation.comment || "Особых пожеланий нет",
            }),
          });
        } catch (err) {
          console.error("FormSubmit direct call failed for " + targetEmail, err);
        }
      }

      setRsvpResult({
        success: true,
        message: "Ответ зафиксирован!",
        emailSent: true,
        targetEmail: targetEmails.join(", "),
      });
    } finally {
      setIsLoadingRsvp(false);
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#590D22] font-sans antialiased pb-28 sm:pb-20 relative overflow-x-hidden selection:bg-[#FFB3C1] selection:text-[#590D22]">
      {/* Bikini Bottom Themed Animated Background with SpongeBob pointing */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.img
          src={spongebobBgImg}
          alt="Спанч Боб указывает на кнопку"
          referrerPolicy="no-referrer"
          initial={{ scale: 1.05 }}
          animate={{
            scale: [1.05, 1.12, 1.07, 1.13, 1.05],
            x: [0, -10, 6, -5, 0],
            y: [0, 6, -8, 5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full object-cover object-[65%_center] sm:object-right opacity-65 sm:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0F3]/60 via-[#FFF0F3]/35 to-[#FFE5EC]/65" />

        {/* Floating Underwater Bubbles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${12 + i * 15}%`, opacity: 0 }}
            animate={{
              y: "-20vh",
              x: [`${12 + i * 15}%`, `${9 + i * 15 + (i % 2 ? 6 : -6)}%`, `${12 + i * 15}%`],
              opacity: [0, 0.45, 0.65, 0.3, 0],
            }}
            transition={{
              duration: 10 + i * 2.5,
              repeat: Infinity,
              delay: i * 2.2,
              ease: "linear",
            }}
            className="absolute rounded-full border border-white/60 bg-white/20 backdrop-blur-[1px] shadow-sm pointer-events-none"
            style={{
              width: `${14 + (i % 3) * 10}px`,
              height: `${14 + (i % 3) * 10}px`,
            }}
          />
        ))}

        <div className="absolute top-[-100px] left-[-100px] w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] bg-[#FFB3C1] rounded-full blur-[70px] opacity-25 animate-pulse" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] bg-[#FF4D6D] rounded-full blur-[80px] opacity-15 animate-pulse" />
      </div>

      <div className="relative z-10 pt-4 sm:pt-6">
        <main className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 space-y-4 sm:space-y-6">
          {/* Hero Invitation Banner */}
          <HeroCard
            herName={invitation.herName}
            senderName={invitation.senderName}
            customMessage={invitation.customMessage}
          />

          {/* Details */}
          <DateDetails
            invitation={invitation}
            onChangeFood={(foodIds) =>
              setInvitation((prev) => ({ ...prev, selectedFoodIds: foodIds }))
            }
            onChangeMusic={(music) =>
              setInvitation((prev) => ({ ...prev, selectedMusic: music }))
            }
            onChangeComment={(comment) =>
              setInvitation((prev) => ({ ...prev, comment }))
            }
          />

          {/* Core Interactive Decision Buttons */}
          <InteractiveButtons
            onAccept={handleAccept}
            isLoading={isLoadingRsvp}
          />
        </main>
      </div>

      {/* Modals & Music Player */}
      <MusicPlayer />
      {showSuccess && (
        <SuccessModal
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
