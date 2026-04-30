-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tenant";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'TECHNICIAN', 'FINANCIAL', 'VIEWER');

-- CreateEnum
CREATE TYPE "tenant"."VehicleSize" AS ENUM ('COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'UTILITY_LIGHT');

-- CreateEnum
CREATE TYPE "tenant"."ServiceOrderStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "tenant"."StockMovementType" AS ENUM ('IN', 'OUT', 'AUTO_CONSUMPTION', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'PAID', 'VOID', 'UNCOLLECTIBLE');

-- CreateEnum
CREATE TYPE "FeatureFlagKey" AS ENUM ('SMART_STOCK', 'ADVANCED_ANALYTICS', 'MULTI_UNIT', 'WHITE_LABEL', 'PUBLIC_API', 'WORKFLOW_ENGINE');

-- CreateEnum
CREATE TYPE "tenant"."MetricKey" AS ENUM ('CHEMICAL_COST_PER_SERVICE', 'PROFIT_PER_SERVICE', 'EMPLOYEE_EFFICIENCY_SCORE', 'WASH_BAY_THROUGHPUT', 'AVG_SERVICE_DURATION', 'STOCK_DEPLETION_FORECAST', 'CUSTOMER_RETENTION_INDEX');

-- CreateTable
CREATE TABLE "Reseller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionalScope" TEXT,
    "whiteLabelBranding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reseller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "resellerId" TEXT,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "unitId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."Unit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."WashBay" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WashBay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."ServiceOrder" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "washBayId" TEXT,
    "customerId" TEXT,
    "vehicleId" TEXT,
    "workflowId" TEXT,
    "currentStepId" TEXT,
    "status" "tenant"."ServiceOrderStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."Customer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."Vehicle" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "model" TEXT,
    "brand" TEXT,
    "color" TEXT,
    "size" "tenant"."VehicleSize" NOT NULL DEFAULT 'COMPACT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."ServiceType" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "workflowId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."ServiceBundle" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."ServiceOrderItem" (
    "id" TEXT NOT NULL,
    "serviceOrderId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ServiceOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."Workflow" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."WorkflowStep" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."WorkflowTransition" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromStepId" TEXT NOT NULL,
    "toStepId" TEXT NOT NULL,

    CONSTRAINT "WorkflowTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."Product" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "unitOfMeasure" TEXT NOT NULL DEFAULT 'UN',
    "currentStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."ServiceProductUsage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vehicleSize" "tenant"."VehicleSize" NOT NULL,
    "estimatedQuantity" DOUBLE PRECISION NOT NULL,
    "wasteFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProductUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."StockMovement" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "tenant"."StockMovementType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "serviceOrderId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "interval" TEXT NOT NULL DEFAULT 'MONTHLY',
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "pdfUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" "FeatureFlagKey" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationFeature" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."UsageMetric" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "unitId" TEXT,
    "key" "tenant"."MetricKey" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "UsageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionPolicy" (
    "id" TEXT NOT NULL,
    "resellerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant"."_ServiceBundleToServiceType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ServiceBundleToServiceType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_organizationId_idx" ON "Membership"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_unitId_key" ON "Membership"("userId", "organizationId", "unitId");

-- CreateIndex
CREATE INDEX "Unit_organizationId_idx" ON "tenant"."Unit"("organizationId");

-- CreateIndex
CREATE INDEX "WashBay_organizationId_idx" ON "tenant"."WashBay"("organizationId");

-- CreateIndex
CREATE INDEX "WashBay_unitId_idx" ON "tenant"."WashBay"("unitId");

-- CreateIndex
CREATE INDEX "ServiceOrder_organizationId_idx" ON "tenant"."ServiceOrder"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceOrder_unitId_idx" ON "tenant"."ServiceOrder"("unitId");

-- CreateIndex
CREATE INDEX "ServiceOrder_washBayId_idx" ON "tenant"."ServiceOrder"("washBayId");

-- CreateIndex
CREATE INDEX "ServiceOrder_customerId_idx" ON "tenant"."ServiceOrder"("customerId");

-- CreateIndex
CREATE INDEX "ServiceOrder_vehicleId_idx" ON "tenant"."ServiceOrder"("vehicleId");

-- CreateIndex
CREATE INDEX "ServiceOrder_workflowId_idx" ON "tenant"."ServiceOrder"("workflowId");

-- CreateIndex
CREATE INDEX "ServiceOrder_currentStepId_idx" ON "tenant"."ServiceOrder"("currentStepId");

-- CreateIndex
CREATE INDEX "Customer_organizationId_idx" ON "tenant"."Customer"("organizationId");

-- CreateIndex
CREATE INDEX "Vehicle_organizationId_idx" ON "tenant"."Vehicle"("organizationId");

-- CreateIndex
CREATE INDEX "Vehicle_customerId_idx" ON "tenant"."Vehicle"("customerId");

-- CreateIndex
CREATE INDEX "ServiceType_organizationId_idx" ON "tenant"."ServiceType"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceType_workflowId_idx" ON "tenant"."ServiceType"("workflowId");

-- CreateIndex
CREATE INDEX "ServiceBundle_organizationId_idx" ON "tenant"."ServiceBundle"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceOrderItem_serviceOrderId_idx" ON "tenant"."ServiceOrderItem"("serviceOrderId");

-- CreateIndex
CREATE INDEX "ServiceOrderItem_serviceTypeId_idx" ON "tenant"."ServiceOrderItem"("serviceTypeId");

-- CreateIndex
CREATE INDEX "Workflow_organizationId_idx" ON "tenant"."Workflow"("organizationId");

-- CreateIndex
CREATE INDEX "WorkflowStep_workflowId_idx" ON "tenant"."WorkflowStep"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowTransition_workflowId_idx" ON "tenant"."WorkflowTransition"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowTransition_fromStepId_idx" ON "tenant"."WorkflowTransition"("fromStepId");

-- CreateIndex
CREATE INDEX "WorkflowTransition_toStepId_idx" ON "tenant"."WorkflowTransition"("toStepId");

-- CreateIndex
CREATE INDEX "Product_organizationId_idx" ON "tenant"."Product"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceProductUsage_organizationId_idx" ON "tenant"."ServiceProductUsage"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceProductUsage_serviceTypeId_idx" ON "tenant"."ServiceProductUsage"("serviceTypeId");

-- CreateIndex
CREATE INDEX "ServiceProductUsage_productId_idx" ON "tenant"."ServiceProductUsage"("productId");

-- CreateIndex
CREATE INDEX "StockMovement_organizationId_idx" ON "tenant"."StockMovement"("organizationId");

-- CreateIndex
CREATE INDEX "StockMovement_productId_idx" ON "tenant"."StockMovement"("productId");

-- CreateIndex
CREATE INDEX "StockMovement_serviceOrderId_idx" ON "tenant"."StockMovement"("serviceOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE INDEX "Invoice_organizationId_idx" ON "Invoice"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationFeature_organizationId_featureId_key" ON "OrganizationFeature"("organizationId", "featureId");

-- CreateIndex
CREATE INDEX "UsageMetric_organizationId_idx" ON "tenant"."UsageMetric"("organizationId");

-- CreateIndex
CREATE INDEX "UsageMetric_unitId_idx" ON "tenant"."UsageMetric"("unitId");

-- CreateIndex
CREATE INDEX "UsageMetric_key_measuredAt_idx" ON "tenant"."UsageMetric"("key", "measuredAt");

-- CreateIndex
CREATE INDEX "CommissionPolicy_resellerId_idx" ON "CommissionPolicy"("resellerId");

-- CreateIndex
CREATE INDEX "_ServiceBundleToServiceType_B_index" ON "tenant"."_ServiceBundleToServiceType"("B");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "Reseller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "tenant"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Unit" ADD CONSTRAINT "Unit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."WashBay" ADD CONSTRAINT "WashBay_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "tenant"."Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "tenant"."Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_washBayId_fkey" FOREIGN KEY ("washBayId") REFERENCES "tenant"."WashBay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "tenant"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "tenant"."Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "tenant"."Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrder" ADD CONSTRAINT "ServiceOrder_currentStepId_fkey" FOREIGN KEY ("currentStepId") REFERENCES "tenant"."WorkflowStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Vehicle" ADD CONSTRAINT "Vehicle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Vehicle" ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "tenant"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceType" ADD CONSTRAINT "ServiceType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceType" ADD CONSTRAINT "ServiceType_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "tenant"."Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceBundle" ADD CONSTRAINT "ServiceBundle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrderItem" ADD CONSTRAINT "ServiceOrderItem_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "tenant"."ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceOrderItem" ADD CONSTRAINT "ServiceOrderItem_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "tenant"."ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Workflow" ADD CONSTRAINT "Workflow_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "tenant"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."WorkflowTransition" ADD CONSTRAINT "WorkflowTransition_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "tenant"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."WorkflowTransition" ADD CONSTRAINT "WorkflowTransition_fromStepId_fkey" FOREIGN KEY ("fromStepId") REFERENCES "tenant"."WorkflowStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."WorkflowTransition" ADD CONSTRAINT "WorkflowTransition_toStepId_fkey" FOREIGN KEY ("toStepId") REFERENCES "tenant"."WorkflowStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceProductUsage" ADD CONSTRAINT "ServiceProductUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceProductUsage" ADD CONSTRAINT "ServiceProductUsage_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "tenant"."ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."ServiceProductUsage" ADD CONSTRAINT "ServiceProductUsage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "tenant"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."StockMovement" ADD CONSTRAINT "StockMovement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "tenant"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."StockMovement" ADD CONSTRAINT "StockMovement_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "tenant"."ServiceOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFeature" ADD CONSTRAINT "OrganizationFeature_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFeature" ADD CONSTRAINT "OrganizationFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."UsageMetric" ADD CONSTRAINT "UsageMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."UsageMetric" ADD CONSTRAINT "UsageMetric_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "tenant"."Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionPolicy" ADD CONSTRAINT "CommissionPolicy_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "Reseller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."_ServiceBundleToServiceType" ADD CONSTRAINT "_ServiceBundleToServiceType_A_fkey" FOREIGN KEY ("A") REFERENCES "tenant"."ServiceBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant"."_ServiceBundleToServiceType" ADD CONSTRAINT "_ServiceBundleToServiceType_B_fkey" FOREIGN KEY ("B") REFERENCES "tenant"."ServiceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
