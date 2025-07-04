import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date in a user-friendly way with robust error handling
 *
 * @param date Date object or date string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!date) {
    return "Invalid date";
  }

  try {
    let dateObj: Date;
    
    if (typeof date === "string") {
      // Handle YYYY-MM-DD format explicitly to avoid timezone issues
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date value:", date);
      return "Invalid date";
    }
    
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Invalid date";
  }
}
