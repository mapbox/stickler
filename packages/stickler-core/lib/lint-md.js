'use strict';

const remark = require('remark');
const pify = require('pify');
const fs = require('fs');
const createVfile = require('vfile');

const remarker = remark()
  .use(require('remark-validate-links'))
  .use(require('remark-lint-blockquote-indentation'), 2)
  .use(require('remark-lint-final-definition'))
  .use(require('remark-lint-no-duplicate-definitions'))
  .use(require('remark-lint-no-multiple-toplevel-headings'))
  .use(require('remark-lint-no-tabs'))
  .use(require('remark-lint-no-undefined-references'));


function lintMdFile(filename) {
  return pify(fs.readFile)(filename, 'utf8')
    .then(contents => {
      const vfile = createVfile({ path: filename, contents });
      return remarker.process(vfile);
    })
}

function lintMd(sticklerConfig, filenames) {
  if (sticklerConfig.lintMd === false) {
    return Promise.resolve();
  }

  return Promise.all(filenames.map(lintMdFile));
}

module.exports = lintMd;
