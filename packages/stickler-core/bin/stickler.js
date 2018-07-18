#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const path = require('path');
const eslintFormatterPretty = require('eslint-formatter-pretty');
const lint = require('../lib/commands/lint');
const format = require('../lib/commands/format');
const reviewStaged = require('../lib/commands/review-staged');
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
  .command(
    'format [options] [files..]',
    'Format files',
    defineFormat,
    runFormat
  )
  .command(
    'review-staged',
    'Review staged files. For use in a precommit hook.',
    defineReviewStaged,
    runReviewStaged
  )
  .demand(1, 'You must specify a command')
  .help().argv;

function defineLint(y) {
  y.version(false)
    .positional('files', filesOptions)
    .help();
}

function runLint(argv) {
  lint(loadConfig(), argv.files)
    .then(results => {
      const didError = results.some(result => result.errorCount > 0);
      if (!didError) {
        return;
      }
      const formattedResults = eslintFormatterPretty(results);
      console.log(formattedResults);
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
  format(loadConfig(), argv.files)
    .then(formattedFilenames => {
      if (argv.quiet) {
        return;
      }

      console.log('Formatted the following files:');
      for (const filename of formattedFilenames) {
        console.log(`  ${path.relative(process.cwd(), filename)}`);
      }
    })
    .catch(handleUnexpectedError);
}

function defineReviewStaged(y) {
  y.version(false).help();
}

function runReviewStaged() {
  reviewStaged().then(code => {
    if (code !== 0) {
      process.exit(1);
    }
  }).catch(handleUnexpectedError);
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
