'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { VEHICLE_SIZES, VEHICLE_SIZE_LABEL } from '@/lib/types';
import { createVehicleAction } from '@/lib/actions';

export function NewVehicleForm({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState<string>('MEDIUM');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await createVehicleAction({
        customerId,
        plate,
        brand,
        model,
        color,
        size: size as 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE',
      });
      if (!res.ok) {
        setError(res.error || 'Falha ao cadastrar veículo.');
        return;
      }
      router.push(`/customers/${customerId}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="plate">Placa</Label>
          <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="ABC1D23" required autoFocus />
        </div>
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="color">Cor</Label>
          <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Preto" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="size" hint="define fator de consumo">Tamanho</Label>
          <Select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
            {VEHICLE_SIZES.map((s) => (
              <option key={s} value={s}>{VEHICLE_SIZE_LABEL[s]}</option>
            ))}
          </Select>
        </div>
      </div>
      {error && <p className="text-xs text-signal-bad" role="alert">{error}</p>}
      <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-4">
        <Link href={`/customers/${customerId}`}>
          <Button variant="ghost" size="md" type="button">Cancelar</Button>
        </Link>
        <Button variant="primary" size="md" type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Cadastrar veículo'}
        </Button>
      </div>
    </form>
  );
}
