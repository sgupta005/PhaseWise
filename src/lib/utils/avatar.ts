/**
 * Extract initials from a name string
 * @param name - Full name of person or project
 * @returns Uppercase initials (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?';
  }

  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/);

  if (words.length === 1) {
    // Single word: take first 2 characters
    return trimmedName.substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generate a consistent color for an avatar based on name
 * @param name - Name to generate color for
 * @returns Tailwind background color class
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}





