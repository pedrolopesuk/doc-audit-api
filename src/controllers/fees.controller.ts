// src/Infra/controllers/fees.controller.ts
import { Controller, Get } from '@nestjs/common';
import { FeeJsonReaderService } from '../Infra/services/fee-json-reader.service';
import { ImportFeesUseCase } from '../Application/use-cases/read-fees/import-fees.use-case';

@Controller('fees')
export class FeesController {
  constructor(
    private readonly loader: FeeJsonReaderService,
    private readonly useCase: ImportFeesUseCase,
  ) {}

  @Get()
  getFees(): Record<string, number> {
    const feesData = this.loader.loadFees();
    return this.useCase.execute(feesData);
  }
}
