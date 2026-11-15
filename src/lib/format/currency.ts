/**
 * PhonePrint - Indian Rupee (INR / ₹) Currency Formatter
 * Formats monetary amounts using the official Indian English locale ('en-IN')
 * adhering to the Indian numbering system and grouping (lakhs, crores).
 *
 * Examples:
 *   formatINR(500)      => "₹500"
 *   formatINR(10000)    => "₹10,000"
 *   formatINR(60000)    => "₹60,000"
 *   formatINR(100000)   => "₹1,00,000"
 */

export interface FormatINROptions extends Intl.NumberFormatOptions {
  decimals?: number;
}

export function formatINR(
  amount: number,
  options?: FormatINROptions
): string {
  const { decimals, ...intlOptions } = options ?? {};
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals !== undefined ? decimals : 0,
    maximumFractionDigits: decimals !== undefined ? decimals : 0,
    ...intlOptions,
  }).format(amount);
}

/**
 * Formats a raw number according to the Indian numbering system without currency symbol.
 * Example:
 *   formatINRNumber(100000) => "1,00,000"
 */
export function formatINRNumber(
  amount: number,
  options?: FormatINROptions
): string {
  const { decimals, ...intlOptions } = options ?? {};
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals !== undefined ? decimals : 0,
    maximumFractionDigits: decimals !== undefined ? decimals : 0,
    ...intlOptions,
  }).format(amount);
}
