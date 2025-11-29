export const PRIORITIES = [
  'Low Priority',
  'Medium Priority',
  'High Priority',
  'Urgent',
] as const;

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
