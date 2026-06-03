/** Formata número como preço BRL: 34 -> "R$ 34" · 39.9 -> "R$ 39,90". */
export function brl(value: number): string {
  const hasCents = !Number.isInteger(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}
