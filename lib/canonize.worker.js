import jsonld from 'jsonld';
import { parentPort, workerData } from 'worker_threads';

const { options, contextObject } = workerData;

parentPort.on('message', async function (message) {
  if (message.terminate) {
    process.exit(0);
  } else {
    try {
      const { line, docIndex } = message;
      const obj = JSON.parse(line);

      if (contextObject) {
        obj['@context'] = contextObject;
      }
      const nquads = (await jsonld.canonize(obj, options))
        // Make sure blank nodes are not clashing across documents
        .replace(/\_\:c14n/g, `_:c14n${docIndex}-`);
      parentPort.postMessage(nquads);
    } catch (err) {
      parentPort.postMessage('');
      console.log('Unknown error processing', message);
      console.error(err);
    }
  }
});
