'use strict';

const globby = require('globby');
const _ = require('lodash');
const micromatch = require('micromatch');
const formatJs = require('../format-js');
const formatMd = require('../format-md');

function format(sticklerConfig, globs) {
  const formatIgnore = sticklerConfig.ignore.concat(['**/package*.json']);

  return globby(globs, {
    ignore: formatIgnore,
    gitignore: true
  }).then(filenames => {
    const jsFilenames = micromatch.match(filenames, '**/*.{js,json}');
    const mdFilenames = micromatch.match(filenames, '**/*.md');

    return Promise.all([
      formatJs(sticklerConfig, jsFilenames),
      formatMd(sticklerConfig, mdFilenames)
    ]).then(results => _.flatten(results));
  });
}

module.exports = format;
