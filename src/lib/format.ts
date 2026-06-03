const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const NUMBER = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

export function formatBRL(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return BRL.format(value);
}

export function formatNumber(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return '0%';
  return `${(value * 100).toLocaleString('pt-BR', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  })}%`;
}

export function formatQuantity(value: number): string {
  return NUMBER.format(value);
}
