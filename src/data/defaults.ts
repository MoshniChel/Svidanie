import { FoodOption, InvitationData } from "../types";

export const DEFAULT_FOOD_OPTIONS: FoodOption[] = [
  { id: "pizza", name: "Итальянская пицца", emoji: "🍕", description: "Хрустящее тесто, тянущийся сыр сыр сыр" },
  { id: "sushi", name: "Роллы и суши", emoji: "🍣", description: "Свежая рыбка, филадельфия и спайси соус" },
  { id: "pasta", name: "Паста & Карбонара", emoji: "🍝", description: "Настоящая итальянская классика" },
  { id: "steaks", name: "Стейк или Бургеры", emoji: "🥩", description: "Сочно, вкусно и очень сытно" },
  { id: "seafood", name: "Морепродукты", emoji: "🦪", description: "Креветки, устрицы или мидии в соусе" },
  { id: "desserts", name: "Десерты и сладости", emoji: "🍨", description: "Тортики, мороженое и авторский кофе" },
  { id: "secret", name: "Секретное блюдо от шефа", emoji: "🎁", description: "Сюрприз, который тебе понравится!" },
];

export const MUSIC_OPTIONS = [
  { id: "romantic", label: "Романтический джаз & лоу-фай 🎷", icon: "🎷" },
  { id: "hits2000", label: "Хиты 2000-х и ностальгия 🎤", icon: "🎤" },
  { id: "indie", label: "Уютный инди-поп & акустика 🎸", icon: "🎸" },
  { id: "cinema", label: "Саундтреки из любимых фильмов 🎬", icon: "🎬" },
];

export const RUNAWAY_PHRASES = [
  "НЕТ",
  "Ты уверена? 🥺",
  "Подумай ещё раз! 🙏",
  "А если я куплю шоколадку? 🍫",
  "Не нажимай меня, я стесняюсь! 🙈",
  "Кнопка 'Да' намного красивее! 👉💖",
  "Ой, кнопка уклонилась! ⚡",
  "Серьёзно? Я буду плакать... 😿",
  "Кажется, кнопка 'Нет' сломалась 🛠️",
  "Без вариантов! Нажимай ДА! ✨",
  "Ладно, сдаюсь, тут тоже кнопка ДА! 🎉",
];

export const DEFAULT_INVITATION: InvitationData = {
  senderName: "Ризабек",
  herName: "Аня",
  dateStr: "29 Августа 2026 года",
  timeStr: "22:00-23:00",
  locationName: "По выбору Ани, но если что я выберу сам и согласую с ней",
  locationAddress: "",
  locationMapUrl: "",
  dressCode: "Любая удобная для тебя одежда ✨",
  notificationEmail: "kolyaogre@gmail.com, podaroqus@gmail.com",
  customMessage: "",
  selectedFoodIds: ["pizza", "desserts"],
  selectedMusic: "romantic",
  comment: "",
};
