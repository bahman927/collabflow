// src/utils/projectHelpers.ts

export const getInitials = (title: string): string =>
  title
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-yellow-100 text-yellow-700",
  "bg-pink-100 text-pink-600",
];

export const getAvatarColor = (title: string): string =>
  avatarColors[title.length % avatarColors.length];
