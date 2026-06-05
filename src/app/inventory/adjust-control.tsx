'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { adjustStockAction } from '@/lib/actions';

interface Props {
  productId: string;
  productName: string;
  unit: string;
}

export function AdjustStockControl({ productId, productName, unit }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState<'PURCHASE' | 'ADJUSTMENT' | 'WASTE'>('PURCHASE');
  const [note, setNote] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(delta.replace(',', '.'));
    if (!Number.isFinite(value) || value === 0) {
      setError('Informe um valor diferente de zero.');
      return;
    }
    start(async () => {
      const res = await adjustStockAction({ productId, delta: value, reason, note: note || undefined });
      if (!res.ok) {
        setError(res.error || 'Falha ao ajustar estoque.');
        return;
      }
      setOpen(false);
      setDelta('');
      setNote('');
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Ajustar
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 flex w-full flex-col gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 sm:mt-0 sm:w-auto sm:flex-row sm:items-end">
      <div className="w-full sm:w-28">
        <Label htmlFor={`d-${productId}`} className="sr-only">Delta {productName}</Label>
        <Input
          id={`d-${productId}`}
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          placeholder="±0,00"
          inputMode="decimal"
          autoFocus
        />
        <span className="mt-1 block text-[10px] text-ink-400">{unit}</span>
      </div>
      <div className="w-full sm:w-36">
        <Label htmlFor={`r-${productId}`} className="sr-only">Motivo</Label>
        <Select id={`r-${productId}`} value={reason} onChange={(e) => setReason(e.target.value as 'PURCHASE' | 'ADJUSTMENT' | 'WASTE')}>
          <option value="PURCHASE">Compra</option>
          <option value="ADJUSTMENT">Ajuste</option>
          <option value="WASTE">Perda</option>
        </Select>
      </div>
      <div className="hidden w-full sm:block sm:w-40">
        <Label htmlFor={`n-${productId}`} className="sr-only">Observação</Label>
        <Input id={`n-${productId}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="observação" />
      </div>
      {error && <p className="w-full text-xs text-signal-bad" role="alert">{error}</p>}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={() => { setOpen(false); setError(null); }}>Cancelar</Button>
        <Button variant="primary" size="sm" type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Aplicar'}
        </Button>
      </div>
    </form>
  );
}
