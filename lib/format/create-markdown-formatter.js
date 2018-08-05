'use strict';

const remark = require('remark');
const createVfile = require('vfile');

const remarkProcessor = remark()
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

function createMarkdownFormatter() {
  const format = (filename, code) => {
    const vfile = createVfile({ path: filename, contents: code });
    return remarkProcessor.process(vfile).then(String);
  };

  return {
    format
  };
}

module.exports = createMarkdownFormatter;
