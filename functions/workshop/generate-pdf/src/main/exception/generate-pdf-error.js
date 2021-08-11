const ApplicationError = require('workshop-commons/exception/application-error');

const ERROR_NAME = require("workshop-commons/util/messages.js").ERROR_NAME;

module.exports = class GeneratePdfError extends ApplicationError {
  constructor(message, externalMessage) {
    super(ERROR_NAME.INTERNAL_SERVER_ERROR, 500, message, externalMessage);
  }
}