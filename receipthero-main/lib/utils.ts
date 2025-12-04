import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes various date formats to YYYY-MM-DD
 * Handles formats like: MM/DD/YYYY, DD/MM/YYYY, MM-DD-YYYY, DD-MM-YYYY, etc.
 */
export function normalizeDate(dateString: string): string {
  if (!dateString) return dateString;

  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Try to parse various formats
  const formats = [
    // MM/DD/YYYY or MM-DD-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // MM/DD/YY or MM-DD-YY (assuming 20xx century)
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/,
    // DD/MM/YY or DD-MM-YY (assuming 20xx century)
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      let [, part1, part2, year] = match;

      // Handle 2-digit years
      if (year.length === 2) {
        year = `20${year}`;
      }

      // For ambiguous formats, try to determine if it's MM/DD or DD/MM
      // If first part > 12, it's likely DD/MM
      // If second part > 12, it's likely MM/DD
      const num1 = parseInt(part1);
      const num2 = parseInt(part2);

      if (num1 > 12 && num2 <= 12) {
        // Likely DD/MM/YYYY
        return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
      } else if (num2 > 12 && num1 <= 12) {
        // Likely MM/DD/YYYY
        return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
      } else {
        // Ambiguous, default to MM/DD/YYYY (US format)
        return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
      }
    }
  }

  // Try parsing with Date constructor as fallback
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // Ignore parsing errors
  }

  // Return original if we can't parse it
  return dateString;
}

/**
 * Validates if a string is in YYYY-MM-DD format
 */
export function isValidDateFormat(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

/**
 * Formats a date string from YYYY-MM-DD to "Month DD, YYYY" format
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date string like "March 15, 2024"
 */
export function formatDisplayDate(dateString: string): string {
  if (!dateString || !isValidDateFormat(dateString)) {
    return dateString; // Return original if not in expected format
  }

  try {
    const date = new Date(dateString + 'T00:00:00'); // Add time to ensure consistent parsing

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Failed to format date:', dateString, error);
    return dateString; // Return original on error
  }
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
