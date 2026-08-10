import { InvitationData } from "../types";

export function downloadIcsFile(invitation: InvitationData) {
  const title = `Свидание с ${invitation.senderName}! 💕`;
  const description = `Важное и самое лучшее свидание сезона!\\nМесто: ${invitation.locationName} (${invitation.locationAddress})\\nДресс-код: ${invitation.dressCode}`;
  const location = `${invitation.locationName}, ${invitation.locationAddress}`;

  // Default date format YYYYMMDDTHHMMSS
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate() + 7).padStart(2, "0"); // 1 week from today as fallback
  
  const startDateStr = `${year}${month}${day}T190000`;
  const endDateStr = `${year}${month}${day}T220000`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DateInvitationApp//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `STATUS:CONFIRMED`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `date_with_${invitation.senderName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function encodeInvitationToUrl(data: InvitationData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.searchParams.set("inv", encoded);
    return url.toString();
  } catch (e) {
    return window.location.href;
  }
}

export function decodeInvitationFromUrl(): InvitationData | null {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get("inv");
    if (!encoded) return null;
    const jsonStr = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}
