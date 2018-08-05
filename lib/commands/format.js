'use strict';

const createSticklerContext = require('../create-stickler-context');
const createSticklerFormatter = require('../format/create-stickler-formatter');
const relativePath = require('../utils/relative-path');

// Returns a string describing which files were formatted
// or undefined if nothing was formatted.
function format({ cwd, globs }) {
  const context = createSticklerContext({ cwd });
  const formatter = createSticklerFormatter(context);
  return formatter.formatGlobs(globs).then(renderOutput);

  function renderOutput(filenames) {
    if (filenames.length !== 0) {
      const renderedFiles = filenames.map(relativePath(cwd)).join('\n');
      return `Formatted the following files:\n${renderedFiles}`;
    }
  }
}

module.exports = format;
