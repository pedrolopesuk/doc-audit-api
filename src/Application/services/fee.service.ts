import { Injectable, Inject } from '@nestjs/common'; // ← Adicionar Inject
import { FeeReader } from '../interfaces/reader-fee.interface';
import { DocumentTypeEnum } from '../../Domain/document/doctype.enum';

@Injectable()
export class FeeService {
  /**
   * Aplica as taxas aos documentos informados.
   * @param documents Array de Document
   */
  attachFeesToDocuments(
    documents: {
      getType: () => any;
      addDocumentFee: (fees: Map<string, string>) => void;
    }[],
  ): void {
    documents.forEach((document) => {
      const fees = this.getFeesForDocument(document.getType());
      document.addDocumentFee(fees);
    });
  }

  constructor(
    @Inject('FeeReader') private readonly feeReader: FeeReader, // ← Usar @Inject com string token
  ) {}

  getFeesForDocument(type: DocumentTypeEnum): Map<string, string> {
    const allFees = this.feeReader.loadFees();

    // Pega apenas o tipo informado no enum
    //const feesForType = allFees[type] ?? {};

    const feesForType = allFees[type];
    if (!feesForType) {
      throw new Error(`Tipo de documento não encontrado no fees.json: ${type}`);
    }

    const feeMap = new Map<string, string>();
    Object.entries(feesForType).forEach(([feeName, feeValue]) => {
      feeMap.set(feeName, feeValue.toString());
    });

    return feeMap;
  }
}
