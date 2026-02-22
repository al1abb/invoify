/**
 * Formats a number with commas and decimal places
 */
export const formatNumberWithCommas = (number: number) => {
  return number.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Validate an email address.
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Check if a string is a data URL.
 */
export const isDataUrl = (str: string) => str.startsWith("data:");
