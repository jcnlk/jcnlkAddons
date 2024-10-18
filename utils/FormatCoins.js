/**
 * Formats a number to a coin string representation
 * @param {number} n - The number to format
 * @returns {string} The formatted coin string
 */
export function formatNumToCoin(n) {
    const integer_n = n.toFixed();
    return integer_n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}