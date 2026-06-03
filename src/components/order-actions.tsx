'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { startOrderAction, completeOrderAction, cancelOrderAction } from '@/lib/actions';

interface Props {
  orderId: string;
  currentStatus: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export function OrderActions({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setError(null);
  }, [currentStatus]);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    start(async () => {
      const res = await fn();
      if (!res.ok) {
        setError(res.error || 'Falha ao atualizar a ordem.');
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {currentStatus === 'QUEUED' && (
          <Button
            variant="primary"
            size="sm"
            disabled={pending}
            onClick={() => run(() => startOrderAction(orderId))}
          >
            Iniciar
          </Button>
        )}
        {currentStatus === 'IN_PROGRESS' && (
          <>
            <Button
              variant="success"
              size="sm"
              disabled={pending}
              onClick={() => run(() => completeOrderAction(orderId))}
            >
              Concluir
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={pending}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.confirm('Cancelar esta ordem? Essa ação não pode ser desfeita.')) {
                    run(() => cancelOrderAction(orderId));
                  }
                }
              }}
            >
              Cancelar
            </Button>
          </>
        )}
        {(currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') && (
          <span className="text-xs text-ink-400">Ordem {currentStatus === 'COMPLETED' ? 'concluída' : 'cancelada'}.</span>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-signal-bad">
          {error}
        </p>
      )}
      <dialog ref={dialogRef} className="rounded-2xl bg-ink-800 p-0 text-ink-50" />
    </div>
  );
}
