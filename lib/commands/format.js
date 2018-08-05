'use strict';

const createSticklerContext = require('../create-stickler-context');
const createSticklerFormatter = require('../format/create-stickler-formatter');
const relativePath = require('../utils/relative-path');

function format({ cwd, globs }) {
  const context = createSticklerContext({ cwd });
  const formatter = createSticklerFormatter(context);
  return formatter.formatGlobs(globs, { overwrite: true }).then(renderOutput);

  function renderOutput(filenames) {
    let formatted = '';
    if (filenames.length !== 0) {
      formatted += 'Formatted the following files:\n';
      formatted += filenames.map(relativePath(cwd)).join('\n');
    }
    return formatted;
  }
}

module.exports = format;
