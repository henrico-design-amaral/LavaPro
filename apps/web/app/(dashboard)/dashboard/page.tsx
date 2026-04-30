import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const org = await prisma.organization.findFirst();
    const workflows = await prisma.workflow.count();
    const services = await prisma.serviceType.count();

    return (
        <div style={{ padding: 24 }}>
            <h1>LavaPro Dashboard</h1>

            <p><strong>Organization:</strong> {org?.name ?? "null"}</p>
            <p><strong>Workflows:</strong> {workflows}</p>
            <p><strong>Service Types:</strong> {services}</p>
        </div>
    );
}