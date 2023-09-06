#!/usr/bin/env node

import { Command } from 'commander';
import { createReadStream, createWriteStream, readFileSync } from 'fs';
import ndjson from 'iterable-ndjson';
import jsonld from 'jsonld';

// Our CLI Program
const program = new Command();

program.name('ndjsonld').description('A CLI for running jsonld commands over ndjson (newline-delimited json) files');

program
  .command('canonize')
  .description('Canonize an ndjson file to nquads')
  .argument('<ndjsonFile>')
  .argument('<outputQuads>')
  .option('-c, --context <contextFile>')
  .option('--unsafe')
  .action(async (inputFile, outputFile, { context, unsafe }) => {
    const source = inputFile === '-' ? process.stdin : createReadStream(inputFile, { autoClose: true });
    const output = outputFile === '-' ? process.stdout : createWriteStream(outputFile, { autoClose: true });
    const contextObject = JSON.parse(readFileSync(context))?.['@context'];

    let docIndex = 0;
    for await (const obj of ndjson.parse(source)) {
      docIndex++;
      if (contextObject) {
        obj['@context'] = contextObject;
      }
      const nquads = (await jsonld.canonize(obj, { safe: !unsafe, compactArrays: false }))
        // Make sure blank nodes are not clashing across documents
        .replace(
          /\_\:c14n/g,
          `_:c14n${docIndex}-`
        );
      output.write(nquads);
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
