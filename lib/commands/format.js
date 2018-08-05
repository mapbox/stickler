'use strict';

const path = require('path');
const SticklerFormatter = require('../format/stickler-formatter');

function format(globs) {
  const formatter = new SticklerFormatter();
  return formatter.formatGlobs(globs, { overwrite: true }).then(renderOutput);
}

function renderOutput(filenames) {
  let formatted = '';
  if (filenames.length !== 0) {
    formatted += 'Formatted the following files:\n';
    formatted += filenames
      .map((filename) => path.relative(process.cwd(), filename))
      .join('\n');
  }
  return formatted;
}

module.exports = format;
