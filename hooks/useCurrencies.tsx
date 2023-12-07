import { useEffect, useState } from "react";

// Variables
import { CURRENCIES_API } from "@/lib/variables";

// Type
import { CurrencyType } from "@/types";

const useCurrencies = () => {
    const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
    const [currenciesLoading, setCurrenciesLoading] = useState<boolean>(false);

    /**
     * Fetches all the currencies asynchronously.
     *
     * @return {Promise<void>} Promise that resolves when the currencies are fetched.
     */
    const fetchCurrencies = async () => {
        setCurrenciesLoading(true);

        try {
            const response = await fetch(`${CURRENCIES_API}`);
            const data = await response.json();

            const currencyOptions = Object.keys(data).map((currencyCode) => {
                const currencyName = data[currencyCode];
                return { code: currencyCode, name: currencyName };
            });

            setCurrencies(currencyOptions);
        } catch (err) {
            console.log(err);
        } finally {
            setCurrenciesLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    return { currencies, currenciesLoading };
};

export default useCurrencies;
