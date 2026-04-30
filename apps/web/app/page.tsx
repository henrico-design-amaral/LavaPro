import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const org = await prisma.organization.findFirst();

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(org, null, 2)}</pre>
    </div>
  );
}