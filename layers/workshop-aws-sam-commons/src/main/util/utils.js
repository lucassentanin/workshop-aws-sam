const ApplicationError = require("../exception/application-error.js");

function isApplicationError(e) {
  return e instanceof ApplicationError;
}

function isStatusCode2xx(statusCode) {
  return statusCode >= 200 && statusCode <= 299;
}

module.exports = {
  isStatusCode2xx,
  isApplicationError,
}