import React, { useState } from "react";
import { X, Copy, Check, Save, Sparkles, Mail, User, Calendar, MapPin, Shirt, MessageSquare } from "lucide-react";
import { InvitationData } from "../types";
import { encodeInvitationToUrl } from "../utils/calendar";

interface SettingsModalProps {
  invitation: InvitationData;
  onSave: (newData: InvitationData) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  invitation,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<InvitationData>({ ...invitation });
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof InvitationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyLink = () => {
    const url = encodeInvitationToUrl(formData);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Настройка приглашения ⚙️
            </h3>
            <p className="text-xs text-slate-500">
              Заполни детали, чтобы создать идеальное приглашение
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-pink-500" /> Её имя
              </label>
              <input
                type="text"
                required
                value={formData.herName}
                onChange={(e) => handleChange("herName", e.target.value)}
                placeholder="Аня"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-rose-500" /> Твоё имя
              </label>
              <input
                type="text"
                required
                value={formData.senderName}
                onChange={(e) => handleChange("senderName", e.target.value)}
                placeholder="Саша"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-500" /> Дата
              </label>
              <input
                type="text"
                required
                value={formData.dateStr}
                onChange={(e) => handleChange("dateStr", e.target.value)}
                placeholder="Суббота, 15 Августа"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                Время
              </label>
              <input
                type="text"
                required
                value={formData.timeStr}
                onChange={(e) => handleChange("timeStr", e.target.value)}
                placeholder="19:00"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Название места
            </label>
            <input
              type="text"
              required
              value={formData.locationName}
              onChange={(e) => handleChange("locationName", e.target.value)}
              placeholder="Уютный ресторан на крыше & прогулка"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Адрес / Подробности места
            </label>
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) => handleChange("locationAddress", e.target.value)}
              placeholder="Центр города, ул. Пушкина, 10"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          {/* Dress Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5 text-purple-500" /> Дресс-код
            </label>
            <input
              type="text"
              value={formData.dressCode}
              onChange={(e) => handleChange("dressCode", e.target.value)}
              placeholder="Удобная обувь для прогулок и хорошее настроение!"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          {/* Notification Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-pink-600" /> Почта для получения ответа (где придёт "ДА")
            </label>
            <input
              type="email"
              required
              value={formData.notificationEmail}
              onChange={(e) => handleChange("notificationEmail", e.target.value)}
              placeholder="kolyaogre@gmail.com"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none font-medium text-pink-900"
            />
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Личное милое послание
            </label>
            <textarea
              rows={2}
              value={formData.customMessage}
              onChange={(e) => handleChange("customMessage", e.target.value)}
              placeholder="Я давно хотел пригласить тебя..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none resize-none"
            />
          </div>

          {/* Submit & Copy Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить настройки</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Ссылка скопирована!" : "Скопировать ссылку для неё"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
