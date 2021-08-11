
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

function runInTrace(record, runFunction) {
  return asyncLocalStorage.run(extractSpan(record), runFunction);
}

function injectTraceLog() {
  console.log = injectTraceLogMethod(console.log);
  console.info = injectTraceLogMethod(console.info);
  console.error = injectTraceLogMethod(console.error);
  console.warn = injectTraceLogMethod(console.warn);
}

function injectTraceHttpHeader(headers) {
  const span = getSpan();

  if (span == null) {
    return headers;
  }
  if (headers == null) {
    headers = {};
  }

  headers['X-B3-TraceId'] = span.traceId
  headers['X-B3-SpanId'] = span.spanId
  headers['X-B3-ParentSpanId'] = span.parentSpanId
  headers['X-B3-Sampled'] = span.sampled

  return headers;
}

function getSpan() {
  return asyncLocalStorage.getStore();
}

function injectTraceLogMethod(methodOriginal) {
  return (...arguments) => {
    args = [];
    const span = getSpan();

    if (span != null) {
      args.push(`[workshop-aws-sam,${span.traceId},${span.spanId},${span.sampled == '1'}]`);
    } else {
      args.push('[workshop-aws-sam,,,}]');
    }

    // Note: arguments is part of the prototype
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    methodOriginal.apply(console, args);
  }
}

function extractSpan(record) {
  const traceId = getSqsStringAttibute(record, 'X-B3-TraceId');
  const spanId = getSqsStringAttibute(record, 'X-B3-SpanId');
  const parentSpanId = getSqsStringAttibute(record, 'X-B3-ParentSpanId');
  const sampled = getSqsStringAttibute(record, 'X-B3-Sampled');

  let span = null;
  if (traceId != null && spanId != null && parentSpanId != null && sampled != null) {
    span = {
      traceId: traceId,
      spanId: spanId,
      parentSpanId: parentSpanId,
      sampled: sampled
    }
  }
  return span;
}

function getSqsStringAttibute(record, name) {
  const attribute = record.messageAttributes[name];
  return attribute == null ? null : attribute.stringValue;
}


module.exports = {
  runInTrace,
  injectTraceLog,
  injectTraceHttpHeader
}