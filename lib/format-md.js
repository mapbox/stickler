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
  .use(require('remark-toc'), { maxDepth: 3, tight: true });

/**
 * Format Markdown files. Overwrites the existing file.
 *
 * @param {Array<string>} filenames
 * @returns {Array<string>} Array of filenames that were formatted.
 */
function formatMd(filenames) {
  return Promise.all(filenames.map(formatMdFile)).then(results => {
    return results.filter(Boolean);
  });
}

function formatMdFile(filename) {
  return pify(fs.readFile)(filename, 'utf8').then(raw => {
    const vfile = createVfile({ path: filename, contents: raw });
    return remarker
      .process(vfile)
      .then(String)
      .then(formatted => {
        // Don't write if the file didn't change.
        if (raw === formatted) {
          return;
        }
        return pify(fs.writeFile)(filename, formatted).then(() => filename);
      });
  });
}

module.exports = formatMd;
