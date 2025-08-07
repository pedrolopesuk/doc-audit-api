import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IEstablishmentRepository } from '../../Application/interfaces/establishment-repository.interface';
import { Establishment } from '../../Domain/establishment/establishment.entity';

@Injectable()
export class PrismaEstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existe(id: string): Promise<boolean> {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
    });
    return !!establishment;
  }

  async getEstablishmentById(id: string): Promise<Establishment | null> {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      return null;
    }

    return new Establishment(
      establishment.id,
      establishment.name,
      establishment.cnpj,
      establishment.address,
    );
  }

  async create(establishment: Establishment): Promise<Establishment> {
    const created = await this.prisma.establishment.create({
      data: {
        id: establishment.id,
        name: establishment.name,
        cnpj: establishment.cnpj,
        address: establishment.address,
      },
    });

    return new Establishment(
      created.id,
      created.name,
      created.cnpj,
      created.address,
    );
  }

  async findAll(): Promise<Establishment[]> {
    const establishments = await this.prisma.establishment.findMany();

    return establishments.map(
      (est) => new Establishment(est.id, est.name, est.cnpj, est.address),
    );
  }
}
