const utils = require('workshop-commons/util/utils');

const GeneratePdfError = require("../../exception/generate-pdf-error");

const { generatePdf } = require('./document/document-definition');
const { addFileToBucket } = require('../storage-service');

module.exports.process = async (recordBody) => {
    try {
        console.info(`Processando body: ${JSON.stringify(recordBody)}`);

        console.info(`Iniciando geracao do PDF de gato.`);
        const pdfBuffer = await generatePdf(recordBody);
        console.info(`PDF de gato gerado com sucesso.`);

        console.info(`Armazenando PDF no bucket S3.`);
        await addFileToBucket(pdfBuffer, 'cat');
        console.info(`PDF armazenado com sucesso.`);

        return recordBody;
    } catch (e) {
        if (utils.isApplicationError(e)) {
            throw e;
        }
        throw new GeneratePdfError(`Erro ao gerar PDF de gato: ${e.message}`, 'Erro ao gerar PDF de gato.', e);
    }
}