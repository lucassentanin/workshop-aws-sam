const middy = require('@middy/core');
const sqsBatch = require('@middy/sqs-partial-batch-failure');
const ssm = require('@middy/ssm');
const isDevelopment = process.env.NODE_ENV === 'development';
const doNotWaitForEmptyEventLoop = require('@middy/do-not-wait-for-empty-event-loop');

const processor = async (event, context) => {
  const recordPromises = event.Records.map((record) => context.service.processMessage(record));
  const processedMessages = await Promise.allSettled(recordPromises);
  const failedMessages = processedMessages.filter((r) => r.status === 'rejected');

  if (failedMessages.length) {
    console.log('Lote processado parcialmente, reenviando mensagens com erro para a fila.');
    return processedMessages;
  }

  console.log('Lote processado com sucesso.');
  return processedMessages;
};

module.exports.sqsHandler = middy(processor)
  .use(doNotWaitForEmptyEventLoop())
  .use(sqsBatch())
  .use(
    ssm({
      cache: true,
      throwOnFailedCall: true,
      cacheExpiryInMillis: 300000,
      paramsLoaded: isDevelopment,
      paramsLoadedAt: new Date(),
      // names: mergeSSMParameters(
      //   {
      //     CLIENT_ID: process.env.CLIENT_ID_SSM_PATH,
      //     CLIENT_SECRET: process.env.CLIENT_SECRET_SSM_PATH,
      //     REDIS_CLUSTER_HOST: process.env.REDIS_CLUSTER_HOST_SSM_PATH,
      //     REDIS_PORT: process.env.REDIS_PORT_SSM_PATH,
      //     AME_PROXY_URL: process.env.AME_PROXY_URL_SSM_PATH,
      //   },
      //   process.env.customSSMParameters
      // ),
    })
  );

// function mergeSSMParameters(defaultParameters, customParameters) {
//   if (customParameters != 'undefined' && customParameters != null) {
//     defaultParameters;
//   }
//   return Object.assign(defaultParameters, JSON.parse(customParameters));
// }
