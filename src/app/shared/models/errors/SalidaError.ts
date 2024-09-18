export class SalidaError extends Error {
  constructor(public override message: string, public code: string) {
    super(message);
    this.name = 'Salida Error';
  }
}
