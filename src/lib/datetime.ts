// LavaPro — date and duration helpers (pt-BR)
// Pure Intl + Date; no external dependency.

const dateLong = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

const dateShort = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const MONTH_PT: Record<string, string> = {
  jan: 'jan', fev: 'fev', mar: 'mar', abr: 'abr', mai: 'mai', jun: 'jun',
  jul: 'jul', ago: 'ago', set: 'set', out: 'out', nov: 'nov', dez: 'dez',
};

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: Date | string | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  return dateLong.format(d).replace(/\b\w/g, (m) => m.toLowerCase());
}

export function formatDateTime(value: Date | string | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  const date = dateTime.format(d);
  return date.replace(',', ' às');
}

export function formatTime(value: Date | string | null | undefined): string {
  const d = toDate(value);
  if (!d) return '—';
  return time.format(d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatRelative(value: Date | string | null | undefined, now: Date = new Date()): string {
  const d = toDate(value);
  if (!d) return '—';
  if (isSameDay(d, now)) return `hoje, ${time.format(d)}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, yesterday)) return `ontem, ${time.format(d)}`;
  return dateShort.format(d);
}

export function formatElapsed(start: Date | string | null | undefined, end?: Date | string | null): string {
  const s = toDate(start);
  if (!s) return '—';
  const e = end ? toDate(end) : new Date();
  if (!e) return '—';
  const diff = e.getTime() - s.getTime();
  if (diff < 0) return '—';
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  return `${seconds}s`;
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export { MONTH_PT };
