export interface FoodOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface InvitationData {
  senderName: string;
  herName: string;
  dateStr: string;
  timeStr: string;
  locationName: string;
  locationAddress: string;
  locationMapUrl: string;
  dressCode: string;
  notificationEmail: string;
  customMessage: string;
  selectedFoodIds: string[];
  selectedMusic: string;
  comment: string;
}

export interface RsvpResponse {
  success: boolean;
  message: string;
  emailSent: boolean;
  targetEmail?: string;
  etherealUrl?: string;
  aiNote?: string;
}
