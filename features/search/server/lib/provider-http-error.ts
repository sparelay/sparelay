export class ProviderHttpError extends Error {
  readonly providerType: string;
  readonly status: number;

  constructor(providerType: string, status: number, detail?: string) {
    super(detail ? `${providerType}: ${detail}` : `${providerType} http ${status}`);
    this.name = "ProviderHttpError";
    this.providerType = providerType;
    this.status = status;
  }
}
