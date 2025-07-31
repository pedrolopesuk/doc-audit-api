// src/Application/use-cases/import-fees.use-case.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportFeesUseCase {
  execute(feesData: any): Record<string, number> {
    // Aqui você pode tratar ou validar os dados se quiser
    return feesData;
  }
}
