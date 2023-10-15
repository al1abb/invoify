/**
 * Formats a number with commas and decimal places
 *
 * @param number Number to format
 *
 * @returns A styled number to be displayed on the invoice
 */
const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const isValidEmail = (email: string) => {
    // Regular expression for a simple email pattern
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

export { formatNumberWithCommas, isValidEmail };
