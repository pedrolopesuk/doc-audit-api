export class Establishment {
  constructor(
    public readonly id: string,
    public name: string,
    public cnpj: string,
    public address: string,
  ) {}

  validarCNPJ(): boolean {
    return /^\d{14}$/.test(this.cnpj.replace(/[^\d]/g, ''));
  }
}
