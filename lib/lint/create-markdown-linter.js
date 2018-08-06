'use strict';

const fs = require('fs');
const flatten = require('lodash.flatten');
const pify = require('pify');
const remark = require('remark');
const createVfile = require('vfile');
const vfileToEslint = require('vfile-to-eslint');

const remarker = remark()
  .use(require('remark-lint-blockquote-indentation'), ['error'])
  .use(require('remark-lint-final-definition'), ['error'])
  .use(require('remark-lint-heading-increment'), ['error'])
  .use(require('remark-lint-no-duplicate-definitions'), ['error'])
  .use(require('remark-lint-no-duplicate-headings-in-section'), ['error'])
  .use(require('remark-lint-no-heading-like-paragraph'), ['error'])
  .use(require('remark-lint-no-multiple-toplevel-headings'), ['error'])
  .use(require('remark-lint-no-tabs'), ['error'])
  .use(require('remark-lint-no-undefined-references'), ['error'])
  .use(require('remark-validate-links'), ['error']);

function createMarkdownLinter() {
  // Each lint function returns an array of ESLint-style results.

  const lintCode = (filename, code) => {
    const vfile = createVfile({ path: filename, contents: code });
    remarker.processSync(vfile);
    return vfileToEslint([vfile]);
  };

  const lintFile = (filename) => {
    return pify(fs.readFile)(filename, 'utf8').then((code) => {
      return lintCode(filename, code);
    });
  };

  const lintFiles = (filenames) => {
    return Promise.all(
      filenames.map((filename) => {
        return lintFile(filename);
      })
    ).then(flatten);
  };

  return {
    lintCode,
    lintFile,
    lintFiles
  };
}

module.exports = createMarkdownLinter;
