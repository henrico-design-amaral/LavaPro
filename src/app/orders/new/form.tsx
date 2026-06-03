'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { VEHICLE_SIZE_LABEL, VEHICLE_SIZES } from '@/lib/types';
import { formatBRL } from '@/lib/format';
import { createOrderAction, createCustomerAction, createVehicleAction } from '@/lib/actions';

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
  vehicles: VehicleOption[];
}

interface VehicleOption {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  size: string;
}

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  durationMin: number;
  description: string | null;
}

interface Props {
  customers: CustomerOption[];
  services: ServiceOption[];
}

export function NewOrderForm({ customers, services }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<Record<string, number>>({});
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showNewVehicle, setShowNewVehicle] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId],
  );

  const total = useMemo(
    () =>
      services.reduce((acc, s) => {
        const q = items[s.id] || 0;
        return acc + s.basePrice * q;
      }, 0),
    [services, items],
  );

  const hasItems = Object.values(items).some((q) => q > 0);

  function setQty(id: string, qty: number) {
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!selectedCustomerId) {
      setError('Selecione um cliente.');
      return;
    }
    if (!selectedVehicleId) {
      setError('Selecione um veículo.');
      return;
    }
    if (!hasItems) {
      setError('Adicione ao menos um serviço com quantidade maior que zero.');
      return;
    }
    const list = Object.entries(items)
      .filter(([, q]) => q > 0)
      .map(([serviceTypeId, quantity]) => ({ serviceTypeId, quantity }));
    start(async () => {
      const res = await createOrderAction({
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        items: list,
        observations: observations || null,
      });
      if (!res.ok || !res.orderId) {
        setError(res.error || 'Falha ao criar a ordem.');
        return;
      }
      router.push(`/orders/${res.orderId}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Label htmlFor="customer" hint={showNewCustomer ? 'preencha ao lado' : `${customers.length} cadastrados`}>Cliente</Label>
          {!showNewCustomer ? (
            <>
              <Select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setSelectedVehicleId('');
                }}
              >
                <option value="">Selecione um cliente…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                className="mt-2 text-[11px] font-medium text-accent-300 hover:text-accent-200"
                onClick={() => setShowNewCustomer(true)}
              >
                + Cadastrar novo cliente
              </button>
            </>
          ) : (
            <NewCustomerInline
              onCancel={() => setShowNewCustomer(false)}
              onCreated={(id) => {
                setSelectedCustomerId(id);
                setShowNewCustomer(false);
              }}
            />
          )}
        </div>

        <div>
          <Label htmlFor="vehicle">Veículo</Label>
          {!showNewVehicle ? (
            <>
              <Select
                id="vehicle"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                disabled={!selectedCustomer}
              >
                <option value="">
                  {selectedCustomer
                    ? selectedCustomer.vehicles.length === 0
                      ? 'Cliente sem veículos cadastrados'
                      : 'Selecione um veículo…'
                    : 'Selecione um cliente primeiro'}
                </option>
                {selectedCustomer?.vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} · {v.brand} {v.model} ({v.color})
                  </option>
                ))}
              </Select>
              {selectedCustomer && (
                <button
                  type="button"
                  className="mt-2 text-[11px] font-medium text-accent-300 hover:text-accent-200 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowNewVehicle(true)}
                  disabled={!selectedCustomerId}
                >
                  + Cadastrar novo veículo para {selectedCustomer.name}
                </button>
              )}
            </>
          ) : (
            <NewVehicleInline
              customerId={selectedCustomerId}
              onCancel={() => setShowNewVehicle(false)}
              onCreated={(id) => {
                setSelectedVehicleId(id);
                setShowNewVehicle(false);
              }}
            />
          )}
        </div>
      </section>

      <section>
        <Label>Serviços contratados</Label>
        {services.length === 0 ? (
          <EmptyState
            title="Sem serviços cadastrados"
            description="Cadastre serviços no catálogo para poder criar ordens."
            action={
              <Link href="/services">
                <Button variant="primary" size="sm">Abrir catálogo</Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.map((s) => {
              const qty = items[s.id] || 0;
              const active = qty > 0;
              return (
                <li
                  key={s.id}
                  className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition-colors ${
                    active
                      ? 'border-accent-500/40 bg-accent-500/[0.06]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-ink-50">{s.name}</p>
                      {active && <Badge tone="accent">selecionado</Badge>}
                    </div>
                    {s.description && (
                      <p className="mt-0.5 truncate text-[11px] text-ink-400">{s.description}</p>
                    )}
                    <p className="mt-1 flex items-center gap-2 text-[11px] text-ink-400">
                      <span className="num text-ink-200">{formatBRL(s.basePrice)}</span>
                      <span className="text-ink-600">·</span>
                      <span>{s.durationMin} min</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Diminuir ${s.name}`}
                      onClick={() => setQty(s.id, Math.max(0, qty - 1))}
                      className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-ink-300 hover:bg-white/[0.05] disabled:opacity-30"
                      disabled={qty === 0}
                    >
                      −
                    </button>
                    <span className="num w-6 text-center text-sm font-semibold text-ink-50">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Aumentar ${s.name}`}
                      onClick={() => setQty(s.id, qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-ink-200 hover:bg-white/[0.05]"
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <Label htmlFor="observations">Observações (opcional)</Label>
        <Textarea
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Aviãozinho, mancha no banco, atenção ao retrovisor…"
        />
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Total previsto</p>
          <p className="num text-2xl font-semibold text-ink-50">{formatBRL(total)}</p>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <p role="alert" className="mr-2 text-xs text-signal-bad">
              {error}
            </p>
          )}
          <Link href="/orders">
            <Button variant="ghost" size="md" type="button">Cancelar</Button>
          </Link>
          <Button variant="primary" size="md" type="submit" disabled={pending}>
            {pending ? 'Criando…' : 'Criar ordem'}
          </Button>
        </div>
      </footer>
    </form>
  );
}

function NewCustomerInline({ onCancel, onCreated }: { onCancel: () => void; onCreated: (id: string) => void }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="nc-name">Nome</Label>
          <Input id="nc-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="nc-phone">Telefone</Label>
          <Input id="nc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="nc-email">E-mail (opcional)</Label>
          <Input id="nc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-signal-bad" role="alert">{error}</p>}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>Cancelar</Button>
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            start(async () => {
              const res = await createCustomerAction({ name, phone, email: email || null });
              if (!res.ok || !res.id) {
                setError(res.error || 'Falha ao criar cliente.');
                return;
              }
              onCreated(res.id);
            });
          }}
        >
          {pending ? 'Salvando…' : 'Cadastrar cliente'}
        </Button>
      </div>
    </div>
  );
}

function NewVehicleInline({ customerId, onCancel, onCreated }: { customerId: string; onCancel: () => void; onCreated: (id: string) => void }) {
  const [pending, start] = useTransition();
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState<string>('MEDIUM');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="nv-plate">Placa</Label>
          <Input id="nv-plate" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="ABC1D23" required />
        </div>
        <div>
          <Label htmlFor="nv-brand">Marca</Label>
          <Input id="nv-brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="nv-model">Modelo</Label>
          <Input id="nv-model" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="nv-color">Cor</Label>
          <Input id="nv-color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Preto" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="nv-size">Tamanho</Label>
          <Select id="nv-size" value={size} onChange={(e) => setSize(e.target.value)}>
            {VEHICLE_SIZES.map((s) => (
              <option key={s} value={s}>{VEHICLE_SIZE_LABEL[s]}</option>
            ))}
          </Select>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-signal-bad" role="alert">{error}</p>}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>Cancelar</Button>
        <Button
          variant="primary"
          size="sm"
          type="button"
          disabled={pending}
          onClick={() => {
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
              if (!res.ok || !res.id) {
                setError(res.error || 'Falha ao criar veículo.');
                return;
              }
              onCreated(res.id);
            });
          }}
        >
          {pending ? 'Salvando…' : 'Cadastrar veículo'}
        </Button>
      </div>
    </div>
  );
}
