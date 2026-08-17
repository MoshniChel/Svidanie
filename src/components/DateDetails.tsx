import React from "react";
import { Calendar, Clock, MapPin, Shirt, MessageSquare, Gift } from "lucide-react";
import { InvitationData } from "../types";

interface DateDetailsProps {
  invitation: InvitationData;
  onChangeFood?: (foodIds: string[]) => void;
  onChangeMusic?: (musicId: string) => void;
  onChangeComment: (comment: string) => void;
}

export const DateDetails: React.FC<DateDetailsProps> = ({
  invitation,
  onChangeComment,
}) => {
  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Key Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Date & Time */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-3 border-[#FF4D6D] shadow-md flex items-start gap-3 sm:gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFB3C1]/50 text-[#FF4D6D] shrink-0 border border-[#FF758F]">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#800F2F] tracking-wider">Когда</div>
            <div className="font-extrabold text-[#590D22] text-base sm:text-lg">
              {invitation.dateStr}
            </div>
            <div className="text-xs text-[#FF4D6D] font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> в {invitation.timeStr}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-3 border-[#FF4D6D] shadow-md flex items-start gap-3 sm:gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFB3C1]/50 text-[#FF4D6D] shrink-0 border border-[#FF758F]">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#800F2F] tracking-wider">Где</div>
            <div className="font-extrabold text-[#590D22] text-sm sm:text-base leading-tight">
              {invitation.locationName}
            </div>
            {invitation.locationAddress ? (
              <div className="text-xs text-[#800F2F] font-medium break-words mt-0.5">{invitation.locationAddress}</div>
            ) : null}
            {invitation.locationMapUrl && (
              <a
                href={invitation.locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-black text-[#FF4D6D] hover:underline mt-1.5 min-h-[32px] flex items-center"
              >
                Открыть на карте 🗺️
              </a>
            )}
          </div>
        </div>

        {/* Dress Code */}
        <div className="sm:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-3 border-[#FF4D6D] shadow-md flex items-start gap-3 sm:gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFB3C1]/50 text-[#FF4D6D] shrink-0 border border-[#FF758F]">
            <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#800F2F] tracking-wider">Дресс-код</div>
            <div className="font-extrabold text-[#590D22] text-xs sm:text-base">
              {invitation.dressCode}
            </div>
          </div>
        </div>

        {/* Who Invites / Payment */}
        <div className="sm:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-3 border-[#FF4D6D] shadow-md flex items-start gap-3 sm:gap-3.5">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFB3C1]/50 text-[#FF4D6D] shrink-0 border border-[#FF758F]">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#800F2F] tracking-wider">От меня</div>
            <div className="font-extrabold text-[#590D22] text-xs sm:text-base leading-snug">
              Я приглашаю — значит все с меня 💳✨🎁🥂💸
            </div>
          </div>
        </div>
      </div>

      {/* Comment Box */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 border-3 border-[#FF4D6D] shadow-md flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4D6D]" />
          <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#590D22]">Особые пожелания?</h4>
        </div>
        <textarea
          value={invitation.comment}
          onChange={(e) => onChangeComment(e.target.value)}
          placeholder="Например: хочу сходить в парк, погулять по набережке после кафешки, хатю бананы и т.д"
          rows={3}
          className="w-full flex-1 p-3 text-base sm:text-sm bg-[#FFF0F3] border-2 border-[#FF758F] rounded-xl focus:outline-none focus:border-[#FF4D6D] resize-none text-[#590D22] font-medium"
        />
      </div>
    </div>
  );
};
