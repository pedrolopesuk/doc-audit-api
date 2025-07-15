export class Document {
  constructor(
    public readonly id: string,
    public name: string,
    public type: string,
    public issuanceFee: string,
    public description: string | null,
    public number: string | null,
    public issueDate: Date,
    public expirationDate: Date,
    public establishmentId: string,
  ) {}

  isExpired(reference: Date = new Date()): boolean {
    return this.expirationDate < reference;
  }
}
