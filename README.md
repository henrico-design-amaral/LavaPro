
# LavaPro v1.0 (Final Monorepo Blueprint)

Production-ready architectural starter for a multi-tenant Vertical SaaS
for car wash and automotive detailing operations.

Includes:

- Multi-tenant schema baseline
- SmartStock auto-consumption engine (hooked)
- RBAC middleware scaffold
- Workflow engine persistence models
- Feature flags layer
- Subscription structure
- Analytics metric table
- Railway + Vercel deploy targets
- Prisma + seed bootstrap

Run locally:

docker-compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
