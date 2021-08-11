const { sqsHandler } = require('workshop-commons/handler/sqs-handler');

const generatePdfService = require('./service/generate-pdf-service');

module.exports.lambdaHandler = async function (event, context) {
  console.log('Evento de geração de PDF recebido:', event);
  context.service = generatePdfService;
  return await sqsHandler(event, context);
};