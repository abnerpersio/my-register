export class RequestError extends Error {
  status: number;

  constructor(message?: string | undefined, status?: number | undefined) {
    super(message);

    this.status = status ?? 500;
  }
}
