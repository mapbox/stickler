'use strict';

const remark = require('remark');
const pify = require('pify');
const fs = require('fs');
const createVfile = require('vfile');

const remarker = remark()
  .use({
    settings: {
      listItemIndent: 1,
      emphasis: '*',
      strong: '*',
      bullet: '-',
      fences: true
    }
  })
  .use(require('remark-toc'));

function formatMdFile(filename) {
  return pify(fs.readFile)(filename, 'utf8').then(raw => {
    const vfile = createVfile({ path: filename, contents: raw });
    return remarker
      .process(vfile)
      .then(String)
      .then(formatted => {
        // Don't write if the file didn't change.
        if (raw !== formatted) {
          return pify(fs.writeFile)(filename, formatted);
        }
      });
  });
}

function formatMd(sticklerConfig, filenames) {
  if (sticklerConfig.formatMd === false) {
    return Promise.resolve();
  }

  return Promise.all(filenames.map(formatMdFile));
}

module.exports = formatMd;
