export default function (amount) {
  const num = parseFloat(amount);
  if (amount == null || isNaN(num)) return "";
  return `$${num.toFixed(2)}`;
}