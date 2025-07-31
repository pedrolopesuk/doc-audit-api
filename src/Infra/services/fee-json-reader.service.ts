import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeeJsonReaderService {
  loadFees(): any {
    const filePath = path.resolve(__dirname, '../../../src/fees.json'); // Caminho relativo
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
}
