'use strict';

const globby = require('globby');
const micromatch = require('micromatch');
const vfileToEslint = require('vfile-to-eslint');
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
      const eslintResults = [
        ...prefixRuleIds('eslint', jsResults),
        ...prefixRuleIds('remark', vfileToEslint(mdResults))
      ];
      return eslintResults;
    });
  });
}

function prefixRuleIds(prefix, results) {
  return results.map(result => {
    result.messages = result.messages.map(message => {
      const unprefixedRuleId = message.ruleId.replace(/^@mapbox\/stickler\//, '');
      message.ruleId = `${prefix}:${unprefixedRuleId}`;
      return message;
    });
    return result;
  });
}

module.exports = lint;
