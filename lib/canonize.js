import { cpus } from 'node:os';
import { Worker } from 'node:worker_threads';

const NUM_CORES = cpus().length;

export async function parallelCanonize(
  sourceIterator,
  outputStream,
  options = {},
  contextObject = undefined,
  numWorkers = NUM_CORES
) {
  outputStream.setMaxListeners(numWorkers * 2);

  const workers = Array.from(
    { length: numWorkers },
    () =>
      new Worker(new URL('./canonize.worker.js', import.meta.url), {
        workerData: { options, contextObject },
      })
  );
  let linesProcessed = 0;
  let linesRead = 0;
  let doneReading = false;

  for (const worker of workers) {
    worker.on('message', async (line) => {
      if (line && !outputStream.write(line)) {
        // Drain buffer periodically
        await new Promise((resolve) => {
          outputStream.once('drain', resolve);
        });
      }
      linesProcessed++;

      if (linesProcessed % (workers.length * workers.length) === 0 && outputStream.flush) {
        // Drain gzip buffer periodically
        await new Promise((resolve) => {
          outputStream.flush(resolve);
        });
      }

      if (!doneReading) {
        const { value, done } = await sourceIterator.next();
        if (!done) {
          linesRead++;
          worker.postMessage({ line: value, docIndex: linesRead });
        } else if (done) {
          doneReading = true;
        }
      }

      if (doneReading && linesProcessed === linesRead) {
        for (const worker of workers) {
          worker.postMessage({ terminate: true });
        }
        if (outputStream !== process.stdout) {
          outputStream.end();
        }
      }
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
      worker.terminate();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  }

  for (const worker of workers) {
    const { value, done } = await sourceIterator.next();
    if (!done && value !== undefined) {
      linesRead++;
      worker.postMessage({ line: value, docIndex: linesRead });
    }
  }
}
