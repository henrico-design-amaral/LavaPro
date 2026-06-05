'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { createCustomerAction } from '@/lib/actions';

export function NewCustomerForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await createCustomerAction({ name, phone, email: email || null, notes: notes || null });
      if (!res.ok || !res.id) {
        setError(res.error || 'Falha ao criar cliente.');
        return;
      }
      router.push(`/customers/${res.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="email">E-mail (opcional)</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferências, restrições, observações recorrentes…" />
        </div>
      </div>
      {error && <p className="text-xs text-signal-bad" role="alert">{error}</p>}
      <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-4">
        <Link href="/customers">
          <Button variant="ghost" size="md" type="button">Cancelar</Button>
        </Link>
        <Button variant="primary" size="md" type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  );
}
