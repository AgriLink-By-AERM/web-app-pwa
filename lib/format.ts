export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatKg(value: number): string {
  return `${new Intl.NumberFormat("en-NG").format(value)}kg`;
}

export function maskPhone(phoneNumber: string): string {
  const trimmed = phoneNumber.trim();

  if (trimmed.length < 8) {
    return trimmed;
  }

  return `${trimmed.slice(0, 3)}****${trimmed.slice(-4)}`;
}
