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
}

export { formatNumberWithCommas }