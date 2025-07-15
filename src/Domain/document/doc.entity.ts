export class Document {
  constructor(
    public readonly id: number,
    public name: string,
    public type: string,
    public issuanceFee: string,
    public description: string | null,
    public number: string | null,
    public issueDate: Date,
    public expirationDate: Date,
    public establishmentId: number,
  ) {}

  isExpired(reference: Date = new Date()): boolean {
    return this.expirationDate < reference;
  }
}
