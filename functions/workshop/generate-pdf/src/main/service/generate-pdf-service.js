const GeneratePdfError = require("../exception/generate-pdf-error");

const generatePdfProcessors = {
  cat: require('./processor/generate-pdf-cat-processor'),
  dog: require('./processor/generate-pdf-dog-processor')
};

exports.processMessage = function (record) {
  console.log('Processando record: ', JSON.stringify(record));

  const recordBody = JSON.parse(record.body);
  validateRecordBody(recordBody);

  const animalType = recordBody.animalType;
  const generatePdfProcessor = generatePdfProcessors[animalType];

  if (!generatePdfProcessor) {
    throw new GeneratePdfError(`Tipo de animal ${animalType} não suportado.`);
  }

  return generatePdfProcessor.process(recordBody);
};

function validateRecordBody(recordBody) {
  if (!recordBody.animalType) {
    throw new GeneratePdfError(`Campo 'animalType' obrigatório.`);
  }
}