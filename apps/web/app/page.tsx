export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 text-center max-w-3xl px-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Lava<span className="text-primary">Pro</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          The ultimate multi-tenant platform for managing your car wash empire. 
          From single units to nationwide franchises.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Sign In
          </a>
          <a
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Go to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
