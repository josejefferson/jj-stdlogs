export class MissingFunctionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingFunctionError'
    Object.setPrototypeOf(this, MissingFunctionError.prototype)
  }
}
