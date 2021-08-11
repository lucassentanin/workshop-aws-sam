const AWS = require('aws-sdk');

async function addFileToBucket(file, pdfName) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.WORKSHOP_GENERATE_PDF_BUCKET,
    Key: `${pdfName}.pdf`,
    Body: file,
  };

  console.info(`Enviando arquivo [${params.Key}] para S3 bucket [${params.Bucket}]`);
  return await s3.putObject(params).promise();
}

module.exports = { addFileToBucket };
