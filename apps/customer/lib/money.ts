export function formatGhs(pesewas: number) {
  const sign = pesewas < 0 ? "-" : "";
  const abs = Math.abs(pesewas);
  const cedis = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${sign}GHS ${cedis}.${rest}`;
}
