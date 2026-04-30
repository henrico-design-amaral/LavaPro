"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const organization = await prisma.organization.create({
        data: {
            name: "LavaPro Demo",
            units: {
                create: {
                    name: "Unidade Principal"
                }
            }
        },
        include: {
            units: true
        }
    });
    console.log("Organization criada:", organization.id);
    const workflow = await prisma.workflow.create({
        data: {
            organizationId: organization.id,
            name: "Lavagem Padrão"
        }
    });
    console.log("Workflow criado:", workflow.id);
    const serviceType = await prisma.serviceType.create({
        data: {
            organizationId: organization.id,
            name: "Lavagem Simples",
            price: 50,
            workflowId: workflow.id
        }
    });
    console.log("ServiceType criado:", serviceType.id);
    await prisma.featureFlag.createMany({
        data: [
            { key: "SMART_STOCK", name: "Smart Stock" },
            { key: "MULTI_UNIT", name: "Multi Unit" },
            { key: "WORKFLOW_ENGINE", name: "Workflow Engine" }
        ],
        skipDuplicates: true
    });
    console.log("FeatureFlags criadas");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
