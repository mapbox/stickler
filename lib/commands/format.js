'use strict';

const flatten = require('lodash.flatten');
const micromatch = require('micromatch');
const globby = require('globby');
const path = require('path');
const prettify = require('../prettify');
const formatMd = require('../format-md');

function format(sticklerConfig, globs) {
  const formatIgnore = sticklerConfig.ignore.concat(['**/package*.json']);

  const prettierExtensions = [];
  if (sticklerConfig.jsFormat) {
    prettierExtensions.push('js');
  }
  if (sticklerConfig.jsonFormat) {
    prettierExtensions.push('json');
  }
  const prettierGlobs =
    prettierExtensions.length !== 0
      ? `**/*.{${prettierExtensions.join(',')}}`
      : null;

  return globby(globs, {
    ignore: formatIgnore,
    gitignore: true,
    absolute: true
  }).then((filenames) => {
    const formatPromises = [];
    if (prettierGlobs) {
      const prettierFilenames = micromatch.match(filenames, prettierGlobs);
      formatPromises.push(prettify(prettierFilenames));
    }
    if (sticklerConfig.mdFormat) {
      const mdFilenames = micromatch.match(filenames, '**/*.md');
      formatPromises.push(formatMd(mdFilenames));
    }

    return Promise.all(formatPromises).then((results) => {
      const flattenedResults = flatten(results);
      return {
        raw: flattenedResults,
        formatted: formatResults(flattenedResults)
      };
    });
  });
}

function formatResults(results) {
  let formatted = '';
  if (results.length !== 0) {
    formatted += 'Formatted the following files:';
    for (const filename of results) {
      formatted += `\n  ${path.relative(process.cwd(), filename)}`;
    }
  }
  return formatted;
}

module.exports = format;
