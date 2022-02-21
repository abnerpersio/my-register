export class RequestError extends Error {
  status: number = 500;

  constructor(message?: string | undefined, status?: number | undefined) {
    super(message);

    if (status) this.status = status;
  }
}
