'use strict';

const remark = require('remark');
const pify = require('pify');
const fs = require('fs');
const createVfile = require('vfile');

const remarker = remark()
  .use(require('remark-validate-links'), ['error'])
  .use(require('remark-lint-blockquote-indentation'), ['error'])
  .use(require('remark-lint-final-definition'), ['error'])
  .use(require('remark-lint-no-duplicate-definitions'), ['error'])
  .use(require('remark-lint-no-multiple-toplevel-headings'), ['error'])
  .use(require('remark-lint-no-undefined-references'), ['error']);

function lintMd(sticklerConfig, filenames) {
  if (sticklerConfig.lintMd === false) {
    return Promise.resolve();
  }

  return Promise.all(filenames.map(lintMdFile));
}

function lintMdFile(filename) {
  return pify(fs.readFile)(filename, 'utf8').then(contents => {
    const vfile = createVfile({ path: filename, contents });
    return remarker.process(vfile);
  });
}

module.exports = lintMd;