'use strict';

const globby = require('globby');
const micromatch = require('micromatch');
const eslintFormatterPretty = require('eslint-formatter-pretty');
const vfileReporterPretty = require('vfile-reporter-pretty');
const lintJs = require('../lint-js');
const lintMd = require('../lint-md');

function lint(sticklerConfig, globs) {
  return globby(globs, {
    ignore: sticklerConfig.ignore,
    gitignore: true
  }).then(filenames => {
    const jsFilenames = micromatch.match(filenames, '**/*.js');
    const mdFilenames = micromatch.match(filenames, '**/*.md');

    return Promise.all([
      lintJs(sticklerConfig, jsFilenames),
      lintMd(sticklerConfig, mdFilenames)
    ]).then(([jsResults, mdResults]) => {
      const formattedJsResults = eslintFormatterPretty(jsResults);
      const formattedMdResults = vfileReporterPretty(mdResults);
      console.log(formattedJsResults);
      console.log(formattedMdResults);
    });
  });
}

module.exports = lint;
