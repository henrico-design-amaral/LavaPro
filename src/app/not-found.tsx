export default function NotFound() {
  return (
    <div className="surface mx-auto mt-12 max-w-md p-8 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-400">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-50">Não encontramos isso</h1>
      <p className="mt-2 text-sm text-ink-300">A página, ordem ou cliente que você procura não existe ou foi removido.</p>
      <a
        href="/"
        className="mt-5 inline-flex h-9 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-ink-100 transition-colors hover:bg-white/[0.07]"
      >
        Voltar ao painel
      </a>
    </div>
  );
}
