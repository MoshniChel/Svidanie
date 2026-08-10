import React, { useState, useEffect } from "react";
import { HeroCard } from "./components/HeroCard";
import { DateDetails } from "./components/DateDetails";
import { InteractiveButtons } from "./components/InteractiveButtons";
import { SuccessModal } from "./components/SuccessModal";
import { DEFAULT_INVITATION } from "./data/defaults";
import { InvitationData, RsvpResponse } from "./types";
import { decodeInvitationFromUrl } from "./utils/calendar";

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

  const handleAccept = async () => {
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
          location: `${invitation.locationName} (${invitation.locationAddress})`,
          foodChoices: foodNames,
          musicChoice: invitation.selectedMusic,
          dressCode: invitation.dressCode,
          comment: invitation.comment,
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
              "Дата и время": `${invitation.dateStr} в ${invitation.timeStr}`,
              "Место": `${invitation.locationName} (${invitation.locationAddress})`,
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
    <div className="min-h-screen bg-[#FFF0F3] text-[#590D22] font-sans antialiased pb-12 relative overflow-x-hidden selection:bg-[#FFB3C1] selection:text-[#590D22]">
      {/* Artistic Flair Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] bg-[#FFB3C1] rounded-full blur-[60px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#FF4D6D] rounded-full blur-[70px] opacity-25 animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] bg-[#FF85A1] rounded-full blur-[50px] opacity-15" />
      </div>

      <div className="relative z-10 pt-6">
        <main className="w-full max-w-2xl mx-auto px-4 space-y-6">
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

      {/* Modals */}
      {showSuccess && (
        <SuccessModal
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
