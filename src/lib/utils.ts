import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number, currency: string = "USD"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(d);
}

// Date utilities for upcoming expenses
import { differenceInDays, format, isToday, isTomorrow } from 'date-fns';

export function formatUpcomingDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const days = differenceInDays(date, new Date());
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days <= 7) return `In ${days} days`;
  
  return format(date, 'MMM d, yyyy');
}

export function getDateUrgency(date: Date): 'overdue' | 'urgent' | 'soon' | 'future' {
  const days = differenceInDays(date, new Date());
  
  if (days < 0) return 'overdue';
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'soon';
  return 'future';
}

export function formatDateBadge(targetDate: Date): string {
  const daysUntil = differenceInDays(targetDate, new Date());
  
  if (daysUntil < 0) {
    return `${Math.abs(daysUntil)} days overdue`;
  } else if (daysUntil === 0) {
    return 'Today';
  } else if (daysUntil === 1) {
    return 'Tomorrow';
  } else if (daysUntil <= 7) {
    return `In ${daysUntil} days`;
  } else {
    return format(targetDate, 'MMM d, yyyy');
  }
}

export function getDateBadgeColor(targetDate: Date): string {
  const daysUntil = differenceInDays(targetDate, new Date());
  
  if (daysUntil < 0) {
    return 'bg-red-100 text-red-700 border-red-300'; // Overdue
  } else if (daysUntil <= 3) {
    return 'bg-yellow-100 text-yellow-700 border-yellow-300'; // Soon
  } else if (daysUntil <= 7) {
    return 'bg-blue-100 text-blue-700 border-blue-300'; // This week
  } else {
    return 'bg-green-100 text-green-700 border-green-300'; // Future
  }
}
