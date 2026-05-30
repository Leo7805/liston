export class AppError extends Error {
  constructor(userMessage: string) {
    super(userMessage);
    this.name = 'AppError';
  }
}
