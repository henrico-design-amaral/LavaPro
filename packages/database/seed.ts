import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting LavaPro seed...");

  // 1. Create a root Reseller & Organization
  const reseller = await prisma.reseller.create({
    data: {
      name: "LavaPro Master Reseller",
    }
  });

  const org = await prisma.organization.create({
    data: {
      name: "Auto Spa Demo",
      resellerId: reseller.id,
      documentNumber: "00.000.000/0001-00",
    }
  });

  console.log(`Created Organization: ${org.name}`);

  // 2. Define Workflow Templates

  // Workflow 1: Lavagem Completa
  const lavagemSteps = ["PreWash", "SnowFoam", "Rinse", "Dry", "Inspection", "Delivery"];

  const lavagemCompleta = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Lavagem Completa",
      description: "Serviço padrão de lavagem de alta qualidade",
      steps: {
        create: lavagemSteps.map((step, index) => ({
          name: step,
          orderIndex: index + 1
        }))
      }
    },
    include: { steps: { orderBy: { orderIndex: 'asc' } } }
  });

  // Create transitions for Lavagem Completa
  for (let i = 0; i < lavagemCompleta.steps.length - 1; i++) {
    await prisma.workflowTransition.create({
      data: {
        workflowId: lavagemCompleta.id,
        fromStepId: lavagemCompleta.steps[i].id,
        toStepId: lavagemCompleta.steps[i + 1].id
      }
    });
  }

  console.log(`Created Workflow: ${lavagemCompleta.name}`);

  // Workflow 2: Polimento Técnico
  const polimentoSteps = ["Wash", "ClayBar", "Cut", "Refinement", "Sealant", "Inspection"];

  const polimentoTecnico = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Polimento Técnico",
      description: "Restauração profunda de pintura",
      steps: {
        create: polimentoSteps.map((step, index) => ({
          name: step,
          orderIndex: index + 1
        }))
      }
    },
    include: { steps: { orderBy: { orderIndex: 'asc' } } }
  });

  // Create transitions for Polimento Técnico
  for (let i = 0; i < polimentoTecnico.steps.length - 1; i++) {
    await prisma.workflowTransition.create({
      data: {
        workflowId: polimentoTecnico.id,
        fromStepId: polimentoTecnico.steps[i].id,
        toStepId: polimentoTecnico.steps[i + 1].id
      }
    });
  }

  console.log(`Created Workflow: ${polimentoTecnico.name}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
