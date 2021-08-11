const PdfPrinter = require('pdfmake');
const getStream = require('get-stream');
const path = require('path');

const imagesPath = path.join(__dirname, 'images');
const fontsPath = path.join(__dirname, 'fonts');

async function generatePdf(data) {
  const docDef = createDocDefinition(data);

  const pdfDoc = createPdfDocument(docDef);

  pdfDoc.end();

  const pdfBuffer = await getBuffer(pdfDoc);

  return pdfBuffer;
}

async function getBuffer(doc) {
  const buffer = await getStream.buffer(doc);

  return buffer;
}

function createPdfDocument(docDef) {
  const printer = createPrinter();
  const document = printer.createPdfKitDocument(docDef);
  return document;
}

function createPrinter() {
  const fonts = {
    Ubuntu: {
      normal: `${fontsPath}/Ubuntu-Regular.ttf`,
      bold: `${fontsPath}/Ubuntu-Medium.ttf`,
      italics: `${fontsPath}/Ubuntu-Italic.ttf`,
      bolditalics: `${fontsPath}/Ubuntu-MediumItalic.ttf`,
    },
  };

  const printer = new PdfPrinter(fonts);
  return printer;
}

function createDocDefinition(data) {
  return {
    content: [
      {
        image: `${imagesPath}/${data.animalType}.jpg`,
        height: 300,
        width: 500,
        alignment: 'center',
      },
    ],

    pageSize: 'A4',
    pageMargins: [30, 30, 30, 30],

    defaultStyle: {
      font: 'Ubuntu',
    },
  };
}

module.exports = {
  generatePdf,
  getBuffer,
  createPdfDocument,
  createDocDefinition,
  createPrinter,
};
