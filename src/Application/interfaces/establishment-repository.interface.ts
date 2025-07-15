import { Establishment } from '../../Domain/establishment/establishment.entity';

export interface IEstablishmentRepository {
  existe(id: string): Promise<boolean>;
  getEstablishmentById(id: string): Promise<Establishment | null>;
  // Outros métodos conforme necessidade
}
