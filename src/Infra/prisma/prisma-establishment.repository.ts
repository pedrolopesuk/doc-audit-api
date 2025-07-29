import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IEstablishmentRepository } from '../../Application/interfaces/establishment-repository.interface';
import { Establishment } from '../../Domain/establishment/establishment.entity';

@Injectable()
export class PrismaEstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existe(id: string): Promise<boolean> {
    const establishment = await this.prisma.estabelecimento.findUnique({
      where: { id },
    });
    return !!establishment;
  }

  async getEstablishmentById(id: string): Promise<Establishment | null> {
    const establishment = await this.prisma.estabelecimento.findUnique({
      where: { id },
    });

    if (!establishment) {
      return null;
    }

    return new Establishment(
      establishment.id,
      establishment.nome,
      establishment.cnpj,
      establishment.endereco,
    );
  }

  async create(establishment: Establishment): Promise<Establishment> {
    const created = await this.prisma.estabelecimento.create({
      data: {
        id: establishment.id,
        nome: establishment.name,
        cnpj: establishment.cnpj,
        endereco: establishment.address,
      },
    });

    return new Establishment(
      created.id,
      created.nome,
      created.cnpj,
      created.endereco,
    );
  }

  async findAll(): Promise<Establishment[]> {
    const establishments = await this.prisma.estabelecimento.findMany();

    return establishments.map(
      (est) =>
        new Establishment(
          est.id,
          est.nome,
          est.cnpj,
          est.endereco,
        ),
    );
  }
}
