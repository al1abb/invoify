// Utils
import numberToWords from "number-to-words";

// Currencies
import currenciesDetails from "@/public/assets/data/currencies.json";

// Types
import { CurrencyDetails } from "@/types";

/**
 * Get currency metadata for wording/cents handling.
 */
export const fetchCurrencyDetails = (
  currency: string
): CurrencyDetails | null => {
  const data = currenciesDetails as Record<string, CurrencyDetails>;
  const currencyDetails = data[currency];
  return currencyDetails || null;
};

/**
 * Convert price to words using currency metadata when available.
 */
export const formatPriceToString = (
  price: number,
  currency: string
): string => {
  let decimals: number;
  let beforeDecimal: string | null = null;
  let afterDecimal: string | null = null;

  const currencyDetails = fetchCurrencyDetails(currency);

  if (currencyDetails) {
    decimals = currencyDetails.decimals;
    beforeDecimal = currencyDetails.beforeDecimal;
    afterDecimal = currencyDetails.afterDecimal;
  } else {
    const priceString = price.toString();
    const decimalIndex = priceString.indexOf(".");
    decimals = decimalIndex !== -1 ? priceString.split(".")[1].length : 0;
  }

  const roundedPrice = parseFloat(price.toFixed(decimals));
  const integerPart = Math.floor(roundedPrice);
  const fractionalMultiplier = Math.pow(10, decimals);
  const fractionalPart = Math.round(
    (roundedPrice - integerPart) * fractionalMultiplier
  );

  const integerPartInWords = numberToWords
    .toWords(integerPart)
    .replace(/^\w/, (c) => c.toUpperCase());

  const fractionalPartInWords =
    fractionalPart > 0 ? numberToWords.toWords(fractionalPart) : null;

  if (integerPart === 0 && fractionalPart === 0) {
    return "Zero";
  }

  let result = integerPartInWords;

  if (beforeDecimal !== null) {
    result += ` ${beforeDecimal}`;
  }

  if (fractionalPartInWords) {
    if (afterDecimal !== null) {
      result += ` and ${fractionalPartInWords} ${afterDecimal}`;
    } else {
      result += ` point ${fractionalPartInWords}`;
    }
  }

  return result;
};
