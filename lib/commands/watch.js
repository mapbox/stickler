'use strict';

const chokidar = require('chokidar');
const { EventEmitter } = require('events');
const chalk = require('chalk');
const timestamp = require('time-stamp');
const eslintFormatterPretty = require('eslint-formatter-pretty');
const createSticklerContext = require('../create-stickler-context');
const createSticklerLinter = require('../lint/create-stickler-linter');
const relativePath = require('../utils/relative-path');
const absolutePath = require('../utils/absolute-path');

function watch({ cwd, globs }) {
  console.log(stampedMessage(`Stickler is watching ...`));
  const context = createSticklerContext({ cwd });
  const linter = createSticklerLinter(context);
  const relativize = relativePath(cwd);
  const absolutize = absolutePath(cwd);

  const emitter = new EventEmitter();
  const emitError = (error) => {
    emitter.emit('error', error);
  };

  try {
    const watcher = chokidar.watch(globs, {
      ignore: context.config.ignore,
      ignoreInitial: true
    });

    const processFile = (filename) => {
      linter.lintGlobs(absolutize(filename)).then((results) => {
        const fileMessage = stampedMessage(`Linted ${relativize(filename)}`);
        const result = results[0];
        if (result.errorCount === 0) {
          console.log(fileMessage + chalk.bold.green(' ✓'));
        } else {
          console.log(fileMessage + chalk.bold.red(' ✖'));
          console.log(eslintFormatterPretty(results));
        }
      }, emitError);
    };

    watcher.on('error', emitError);
    watcher.on('change', processFile);
  } catch (error) {
    emitError(error);
  }

  return emitter;
}

function stampedMessage(message) {
  const time = chalk.grey(timestamp('HH:mm:ss'));
  const prefix = `[${time} ${chalk.cyan('stickler')}]`;
  return `${prefix} ${message}`;
}

module.exports = watch;
