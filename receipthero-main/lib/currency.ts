// https://currency-api.pages.dev/v1/currencies/usd.json

type CurrencyRates = {
  [key: string]: number;
};

type CurrencyApiResponse = {
  date: string;
  usd: CurrencyRates;
};

// singleton currency rates object
let todayCurrencyRatesUsd: CurrencyApiResponse | undefined = undefined;
let isFetching = false;
let fetchPromise: Promise<void> | undefined = undefined;

const ensureRatesLoaded = async () => {
  if (todayCurrencyRatesUsd) {
    return;
  }

  if (isFetching && fetchPromise) {
    await fetchPromise;
    return;
  }

  if (isFetching) {
    // Wait for ongoing fetch
    while (isFetching) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return;
  }

  isFetching = true;
  fetchPromise = (async () => {
    try {
      const response = await fetch(
        "https://currency-api.pages.dev/v1/currencies/usd.json",
        {
          next: {
            revalidate: 86400, // 24 hours in seconds
          },
        }
      );
      const data = await response.json();
      todayCurrencyRatesUsd = data;
    } finally {
      isFetching = false;
      fetchPromise = undefined;
    }
  })();

  await fetchPromise;
};

export const getUSDConversionRate = async (currency: string) => {
  await ensureRatesLoaded();

  if (!todayCurrencyRatesUsd) {
    throw new Error("Currency rates not found");
  }

  const rate = todayCurrencyRatesUsd.usd[currency.toLowerCase()];

  return rate;
};

// Batch version for multiple currencies
export const getMultipleUSDConversionRates = async (currencies: string[]) => {
  await ensureRatesLoaded();

  if (!todayCurrencyRatesUsd) {
    throw new Error("Currency rates not found");
  }

  const rates: { [key: string]: number } = {};
  for (const currency of currencies) {
    const rate = todayCurrencyRatesUsd.usd[currency.toLowerCase()];
    if (rate) {
      rates[currency.toUpperCase()] = rate;
    }
  }

  return rates;
};
