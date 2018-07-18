'use strict';

const yargs = require('yargs');
const path = require('path');
const lint = require('../lib/commands/lint');
const format = require('../lib/commands/format');
const configUtils = require('../lib/config-utils');

const filesOptions = {
  description:
    'Files or globs. Wrap globs in quotation marks for cross-platform consistency.',
  type: 'string',
  normalize: true
};

yargs
  .usage('$0 <command>')
  .command('lint [files..]', 'Lint files', defineLint, runLint)
  .command('format [files..]', 'Format files', defineFormat, runFormat)
  .demand(1, 'You must specify a command')
  .help().argv;

function defineLint(y) {
  y.version(false)
    .positional('files', filesOptions)
    .help();
}

function runLint(argv) {
  lint(loadConfig(), argv.files);
}

function defineFormat(y) {
  y.version(false)
    .positional('files', filesOptions)
    .help();
}

function runFormat(argv) {
  format(loadConfig(), argv.files);
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
