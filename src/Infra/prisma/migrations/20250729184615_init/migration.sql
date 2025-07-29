-- CreateTable
CREATE TABLE "Estabelecimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "Estabelecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "numero" TEXT,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "taxaEmissao" TEXT NOT NULL,
    "estabelecimentoId" TEXT NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependencia" (
    "id" TEXT NOT NULL,
    "documentoId" TEXT NOT NULL,
    "dependeDeId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Dependencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estabelecimento_cnpj_key" ON "Estabelecimento"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Dependencia_documentoId_dependeDeId_key" ON "Dependencia"("documentoId", "dependeDeId");

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependencia" ADD CONSTRAINT "Dependencia_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "Documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependencia" ADD CONSTRAINT "Dependencia_dependeDeId_fkey" FOREIGN KEY ("dependeDeId") REFERENCES "Documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
