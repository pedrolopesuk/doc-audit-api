import { Injectable } from '@nestjs/common';
import { FeeReader } from '../../Application/interfaces/reader-fee.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeeJsonReaderService implements FeeReader {
  loadFees(): any {
    const filePath = path.resolve(__dirname, '../../../src/fees.json'); // Caminho relativo
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
}
