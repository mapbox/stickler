'use strict';

const path = require('path');
const chokidar = require('chokidar');
const { EventEmitter } = require('events');
const chalk = require('chalk');
const timestamp = require('time-stamp');
const lint = require('./lint');

function watch(sticklerConfig, globs) {
  console.log(stampedMessage(`Stickler is watching ...`));

  const emitter = new EventEmitter();
  const emitError = (error) => {
    emitter.emit('error', error);
  };

  try {
    const watcher = chokidar.watch(globs, {
      ignore: sticklerConfig.ignore,
      ignoreInitial: true
    });

    const processFile = (filename) => {
      const relativeFilename = path.relative(process.cwd(), filename);
      lint(sticklerConfig, filename).then((results) => {
        console.log(stampedMessage(`Linted ${relativeFilename}`));
        if (results.formatted) {
          console.log(results.formatted);
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
  const stamp = `[${chalk.grey(timestamp('HH:mm:ss'))} ${chalk.cyan(
    'stickler'
  )}]`;
  return `${stamp} ${message}`;
}

module.exports = watch;
