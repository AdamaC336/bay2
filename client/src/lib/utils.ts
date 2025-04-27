import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatDateRelative(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return date > now ? 'Tomorrow' : 'Yesterday';
  } else if (diffDays < 7) {
    return `in ${diffDays} days`;
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'paused':
    case 'stopped':
      return 'red';
    case 'in_progress':
    case 'in progress':
      return 'blue';
    case 'todo':
    case 'to do':
      return 'yellow';
    case 'done':
      return 'green';
    default:
      return 'gray';
  }
}

export function getRandomColor(): string {
  const colors = ['blue', 'green', 'purple', 'yellow', 'red', 'pink', 'indigo', 'cyan'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function calculateYearToDateStats(data: {date: Date, amount: number}[]): {
  total: number;
  average: number;
  max: number;
  min: number;
} {
  if (!data.length) {
    return { total: 0, average: 0, max: 0, min: 0 };
  }
  
  const amounts = data.map(item => item.amount);
  const total = amounts.reduce((sum, current) => sum + current, 0);
  
  return {
    total,
    average: total / amounts.length,
    max: Math.max(...amounts),
    min: Math.min(...amounts)
  };
}

export function getWeekdayName(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

export function getMonthName(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
}
