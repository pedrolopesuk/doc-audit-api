export class Dependency {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly dependentDocumentId: string,
    public readonly type: string, // ex: 'reference', 'legal', etc
  ) {}

  mesmaDependenciaOutro(): boolean {
    return this.documentId === this.dependentDocumentId;
  }
}
