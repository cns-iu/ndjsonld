# ndjsonld
A CLI for running jsonld commands over ndjson (newline-delimited json) files

[![npm version](https://badge.fury.io/js/rdf-formatter.svg)](https://badge.fury.io/js/ndjsonld) ![npm](https://img.shields.io/npm/l/ndjsonld)

## Installation

You can install globally via npm: `npm install -g ndjsonld`. Afterwards, the `ndjsonld` CLI will be available on command-line.

## Limitations

Currently only `canonize` is implemented. I plan to do the others, but I had an immediate need for `canonize`.

## Usage

```bash
Usage: ndjsonld [options] [command]

A CLI for running jsonld commands over ndjson (newline-delimited json) files

Options:
  -h, --help                                     display help for command

Commands:
  canonize [options] <ndjsonFile> <outputQuads>  Canonize an ndjson file to nquads
  format                                         Help Wanted
  lint                                           Help Wanted
  compact                                        Help Wanted
  expand                                         Help Wanted
  flatten                                        Help Wanted
  frame                                          Help Wanted
  toRdf                                          Help Wanted
  help [command]                                 display help for command
```

For `canonize`
```bash
Usage: ndjsonld canonize [options] <ndjsonFile> <outputQuads>

Canonize an ndjson file to nquads

Options:
  -c, --context <contextFile>
  --unsafe
  -h, --help                   display help for command
```