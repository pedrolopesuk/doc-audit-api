export class Dependency {
  constructor(
    public readonly id: number,
    public readonly documentId: number,
    public readonly dependentDocumentId: number,
    public readonly type: string, // ex: 'reference', 'legal', etc
  ) {}

  mesmaDependenciaOutro(): boolean {
    return this.documentId === this.dependentDocumentId;
  }
}
