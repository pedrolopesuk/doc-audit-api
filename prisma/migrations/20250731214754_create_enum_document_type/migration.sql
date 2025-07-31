/*
  Warnings:

  - You are about to drop the `Dependencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estabelecimento` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BUSINESS_LICENSE', 'TAX_REGISTRATION', 'CNPJ_REGISTRATION', 'OPERATING_PERMIT', 'FIRE_DEPARTMENT_CERTIFICATE', 'HEALTH_LICENSE', 'TRADE_BOARD_REGISTRATION', 'COMPANY_ARTICLES', 'INSS_CERTIFICATE', 'LABOR_CERTIFICATE', 'FGTS_CERTIFICATE', 'MUNICIPAL_DEBT_CLEARANCE', 'FEDERAL_DEBT_CLEARANCE', 'ENVIRONMENTAL_LICENSE');

-- DropForeignKey
ALTER TABLE "Dependencia" DROP CONSTRAINT "Dependencia_dependeDeId_fkey";

-- DropForeignKey
ALTER TABLE "Dependencia" DROP CONSTRAINT "Dependencia_documentoId_fkey";

-- DropForeignKey
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_estabelecimentoId_fkey";

-- DropTable
DROP TABLE "Dependencia";

-- DropTable
DROP TABLE "Documento";

-- DropTable
DROP TABLE "Estabelecimento";

-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "description" TEXT,
    "number" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "issueFee" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependency" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "dependsOnId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_cnpj_key" ON "Establishment"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Dependency_documentId_dependsOnId_key" ON "Dependency"("documentId", "dependsOnId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
