import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStudentEmail(email: string) {
  const [localPart, domain] = email.split('@');
  const isBennett = domain?.toLowerCase() === 'bennett.edu.in';
  const studentRegex = /^([A-Za-z]*)(\d{2})([A-Za-z]+)(\d+)$/;
  return isBennett && studentRegex.test(localPart);
}
