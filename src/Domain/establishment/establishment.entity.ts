import { randomUUID } from 'crypto';
export class Establishment {
  private _id: string;
  private _name: string;
  private _cnpj: string;
  private _address: string;
  constructor(
    public name: string,
    public cnpj: string,
    public address: string,
  ) {
    this._id = randomUUID();
    this._name = name;
    this._cnpj = cnpj;
    this._address = address;
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this._name;
  }

  getCnpj(): string {
    return this._cnpj;
  }

  getAddress(): string {
    return this._address;
  }

  setName(name: string): void {
    if (!name) {
      throw new Error('O campo name é obrigatório.');
    }
    this._name = name;
  }

  setCnpj(cnpj: string): void {
    if (!cnpj) {
      throw new Error('O campo cnpj é obrigatório.');
    }
    this._cnpj = cnpj;
  }

  setAddress(address: string): void {
    if (!address) {
      throw new Error('O campo address é obrigatório.');
    }
    this._address = address;
  }
}
