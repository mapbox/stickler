#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const path = require('path');
const lint = require('../lib/commands/lint');
const format = require('../lib/commands/format');
const precommit = require('../lib/commands/precommit');
const watch = require('../lib/commands/watch');
const configUtils = require('../lib/config-utils');
const absolutePath = require('../lib/absolute-path');

const DEFAULT_GLOB = '**/*.{js,json,md}';

const filesOptions = {
  description:
    'Files or globs. Wrap globs in quotation marks for cross-platform consistency.',
  type: 'array',
  normalize: true,
  default: [DEFAULT_GLOB]
};

yargs
  .usage('$0 <command>')
  .command('lint [files..]', 'Lint files', defineLint, runLint)
  .command('format [files..]', 'Format files', defineFormat, runFormat)
  .command(
    'precommit',
    'Lint and format staged files. For use in scripts.precommit.',
    definePrecommit,
    runPrecommit
  )
  .command(
    'watch [globs..]',
    'Lint files when they change',
    defineWatch,
    runWatch
  )
  .demand(1, 'You must specify a command')
  .help().argv;

function defineLint(y) {
  y.version(false)
    .positional('files', filesOptions)
    .help();
}

function runLint(argv) {
  lint(loadConfig(), argv.files.map(absolutePath))
    .then(results => {
      const didError = results.raw.some(result => result.errorCount > 0);
      if (!didError) {
        return;
      }
      console.log(results.formatted);
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
  format(loadConfig(), argv.files.map(absolutePath))
    .then(results => {
      if (argv.quiet) {
        return;
      }
      console.log(results.formatted);
    })
    .catch(error => {
      // Print Prettier SyntaxErrors without the stack trace.
      if (SyntaxError.prototype.isPrototypeOf(error)) {
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
    .then(code => {
      if (code !== 0) {
        process.exit(1);
      }
    })
    .catch(handleUnexpectedError);
}

function defineWatch(y) {
  y.version(false)
    .positional('globs', {
      description:
        'Filenames or globs wrapped in quotation marks. Use string globs if you want the watcher to pick up on newly created files.',
      type: 'array'
    })
    .help();
}

function runWatch(argv) {
  const globs = argv.globs.length !== 0 ? argv.globs : [DEFAULT_GLOB];
  const emitter = watch(loadConfig(), globs.map(absolutePath));
  emitter.on('error', handleUnexpectedError);
}

function loadConfig() {
  let config = {};
  try {
    config = require(path.join(process.cwd(), 'stickler.config.js'));
  } catch (error) {
    /* ignore */
  }

  return configUtils.normalize(config);
}

function handleUnexpectedError(error) {
  console.error(error.stack ? error.stack : error);
  process.exit(1);
}
