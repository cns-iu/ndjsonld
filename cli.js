#!/usr/bin/env node

import { Command } from 'commander';
import jsonld from 'jsonld';
import { createReadStream, createWriteStream, readFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { parallelCanonize } from './lib/canonize.js';
import { readLines } from './lib/read-lines.js';

// Our CLI Program
const program = new Command();

program.name('ndjsonld').description('A CLI for running jsonld commands over ndjson (newline-delimited json) files');

program
  .command('canonize')
  .description('Canonize an ndjson file to nquads')
  .argument('<ndjsonFile>')
  .argument('<outputQuads>')
  .option(
    '-p, --parallel <numWorkers>',
    'Number of parallel processes to use. This may result in valid, but out of order data files if n != 1',
    1
  )
  .option('-c, --context <contextFile>')
  .option('--unsafe')
  .action(async (inputFile, outputFile, { context, unsafe, parallel }) => {
    const source = inputFile === '-' ? process.stdin : createReadStream(inputFile, { autoClose: true });
    const output = outputFile === '-' ? process.stdout : createWriteStream(outputFile, { autoClose: true });
    const contextObject = JSON.parse(readFileSync(context))?.['@context'];
    const options = { safe: !unsafe, compactArrays: false };

    if (parallel == 1) {
      let docIndex = 0;
      for await (const line of readLines(source)) {
        const obj = JSON.parse(line);
        docIndex++;
        if (contextObject) {
          obj['@context'] = contextObject;
        }
        const nquads = (await jsonld.canonize(obj, options))
          // Make sure blank nodes are not clashing across documents
          .replace(/\_\:c14n/g, `_:c14n${docIndex}-`);
        output.write(nquads);
      }
    } else {
      if (!parallel || parallel < 1) {
        parallel = cpus().length;
      }

      await parallelCanonize(readLines(source), output, options, contextObject, parallel);
    }
  });

program
  .command('format')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('lint')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('compact')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('expand')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('flatten')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('frame')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program
  .command('toRdf')
  .description('Help Wanted')
  .action(() => console.log('Help Wanted'));

program.parse(process.argv);
