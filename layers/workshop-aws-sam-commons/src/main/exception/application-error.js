module.exports = class ApplicationError extends Error {
  constructor(name, statusCode, message, externalMessage) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.externalMessage = externalMessage == null ? message : externalMessage;
  }
}