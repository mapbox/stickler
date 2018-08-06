#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const lint = require('../lib/commands/lint');
const format = require('../lib/commands/format');
const precommit = require('../lib/commands/precommit');
const watch = require('../lib/commands/watch');
const absolutePath = require('../lib/utils/absolute-path');

const DEFAULT_GLOB = '**/*.{js,json,md}';

const filesOptions = {
  description:
    'Files or globs. Wrap globs in quotation marks for cross-platform consistency.',
  type: 'array',
  normalize: true,
  default: [DEFAULT_GLOB]
};

const cwd = process.cwd();

yargs
  .usage('$0 <command>')
  .command('lint [files..]', 'Lint files.', defineLint, runLint)
  .command('format [files..]', 'Format files.', defineFormat, runFormat)
  .command(
    'precommit',
    'Lint and format staged files. For use in scripts.precommit in package.json.',
    definePrecommit,
    runPrecommit
  )
  .command(
    'watch [files..]',
    'Lint files when they change.',
    defineWatch,
    runWatch
  )
  .demand(1, 'ERROR: You must specify a command')
  .help().argv;

function defineLint(y) {
  y.version(false)
    .positional('files', filesOptions)
    .help();
}

function runLint(argv) {
  lint({ cwd, globs: argv.files.map(absolutePath(cwd)) })
    .then((results) => {
      if (!results) {
        return;
      }
      console.log(results);
      process.exit(1);
    })
    .catch(handleUnexpectedError);
}

function defineFormat(y) {
  y.version(false)
    .option('quiet', {
      description: "Don't log a list of formatted files",
      alias: 'q',
      type: 'boolean'
    })
    .positional('files', filesOptions)
    .help();
}

function runFormat(argv) {
  format({ cwd, globs: argv.files.map(absolutePath(cwd)) })
    .then((results) => {
      if (argv.quiet) {
        return;
      }
      if (results) {
        console.log(results);
      }
    })
    .catch((error) => {
      // Print Prettier SyntaxErrors without the stack trace.
      if (error instanceof SyntaxError) {
        console.error(`SyntaxError: ${error.message}`);
      } else {
        handleUnexpectedError(error);
      }
    });
}

function definePrecommit(y) {
  y.version(false).help();
}

function runPrecommit() {
  precommit()
    .then((result) => {
      if (result.errored) {
        process.exit(1);
      }
    })
    .catch(handleUnexpectedError);
}

function defineWatch(y) {
  y.version(false)
    .positional('files', {
      description:
        'Filenames or globs wrapped in quotation marks. Use string globs if you want the watcher to pick up on newly created files.',
      type: 'array',
      normalize: true,
      default: [DEFAULT_GLOB]
    })
    .help();
}

function runWatch(argv) {
  const globs =
    argv.globs && argv.globs.length !== 0 ? argv.globs : [DEFAULT_GLOB];
  const emitter = watch({ cwd, globs: globs.map(absolutePath(cwd)) });
  emitter.on('error', handleUnexpectedError);
}

function handleUnexpectedError(error) {
  console.error(error.stack ? error.stack : error);
  process.exit(1);
}
