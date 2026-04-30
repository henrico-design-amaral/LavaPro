import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


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