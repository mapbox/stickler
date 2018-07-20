'use strict';

const _ = require('lodash');
const micromatch = require('micromatch');
const globby = require('globby');
const path = require('path');
const formatJs = require('../format-js');
const formatMd = require('../format-md');

function format(sticklerConfig, globs) {
  const formatIgnore = sticklerConfig.ignore.concat(['**/package*.json']);

  return globby(globs, {
    ignore: formatIgnore,
    gitignore: true,
    absolute: true
  }).then(filenames => {
    const jsFilenames = micromatch.match(filenames, '**/*.{js,json}');
    const mdFilenames = micromatch.match(filenames, '**/*.md');

    return Promise.all([
      formatJs(sticklerConfig, jsFilenames),
      formatMd(sticklerConfig, mdFilenames)
    ]).then(results => {
      const formattedFilenames = _.flatten(results);
      let formatted = '';
      if (formattedFilenames.length !== 0) {
        formatted += 'Formatted the following files:';
        for (const filename of formattedFilenames) {
          formatted += `\n  ${path.relative(process.cwd(), filename)}`;
        }
      }
      return {
        raw: formattedFilenames,
        formatted
      };
    });
  });
}

module.exports = format;
