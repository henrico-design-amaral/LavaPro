# LavaPro Architecture

LavaPro is a production-ready, multi-tenant Vertical SaaS platform designed for car wash businesses, ranging from single units to nationwide franchises.

## Domain-Driven Monorepo Layout

The repository uses a workspace-based monorepo layout (via npm/pnpm/yarn workspaces).

```text
LavaPro/
├── apps/
│   ├── web/               # Next.js App Router frontend (Dashboard, Landing, Auth)
│   └── api/               # External/Public API (optional, if separate from Next.js)
├── packages/
│   ├── database/          # Prisma schema, migrations, and generated client
│   ├── domain/            # Core business logic, domain models, and shared DTOs/schemas (Zod)
│   └── ui/                # Shared Tailwind + shadcn/ui React components
├── infra/
│   ├── docker/            # Docker Compose files for local dev (PostgreSQL, Redis, etc.)
│   ├── railway/           # Railway deployment configurations & scripts
│   └── vercel/            # Vercel specific settings
└── docs/                  # Architectural diagrams, ADRs, and documentation
```

## Next.js App Router Structure (`apps/web`)

```text
apps/web/
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider, AuthProvider
│   ├── page.tsx                  # Marketing / Landing Page
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/page.tsx        
│   │   └── register/page.tsx     
│   ├── (dashboard)/              # SaaS Dashboard route group (authenticated)
│   │   ├── layout.tsx            # Dashboard sidebar, header, user profile
│   │   ├── [tenantId]/           # Dynamic routing for multi-tenant organizations
│   │   │   ├── page.tsx          # Org overview
│   │   │   ├── units/            # Unit management
│   │   │   ├── wash-bays/        # Wash Bay operations
│   │   │   └── service-orders/   # Service Orders tracking
│   └── api/                      # Next.js Route Handlers (Auth.js, Webhooks)
├── components/                   # Web-specific components (or imported from packages/ui)
└── lib/                          # Web-specific utilities
```

## Database Architecture (Prisma)

The operational domain focuses on isolation and multi-tenancy. We employ a schema-per-tenant-ready structure. The current model utilizes a combined approach of `organizationId` and `unitId` indexing, with `@@schema` attributes prepared for PostgreSQL schema-level isolation.

### Entity Hierarchy

1. **Reseller** (Master-tenant / Partner)
2. **Organization** (Primary SaaS Tenant)
3. **Unit** (Physical Location / Franchise)
4. **WashBay** (Work Area within a Unit)
5. **ServiceOrder** (Operational Job)

*All operational entities strictly map to an `organizationId` and `unitId` to enforce row-level or schema-level security.*
