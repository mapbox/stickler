'use strict';

const globby = require('globby');
const pify = require('pify');
const fs = require('fs');
const globber = require('../utils/globber');
const createPrettifier = require('./create-prettifier');
const createMarkdownFormatter = require('./create-markdown-formatter');

const formatIgnoreDefault = ['**/package*.json'];

// Creates a formatter object that exposes the following functions:
// - formatCode
// - formatGlobs
function createSticklerFormatter(sticklerContext) {
  const { config, isGitignored } = sticklerContext;
  const ignoreGlobs = formatIgnoreDefault.concat(config.ignore);

  const prettierExtensions = [];
  if (config.jsFormat) {
    prettierExtensions.push('js', 'jsx');
  }
  if (config.jsonFormat) {
    prettierExtensions.push('json');
  }
  const prettierGlobs =
    prettierExtensions.length !== 0
      ? [`**/*.{${prettierExtensions.join(',')}}`]
      : [];
  const markdownGlobs = config.mdFormat ? ['**/*.md'] : [];

  const prettifier = createPrettifier();
  const markdownFormatter = createMarkdownFormatter();

  const shouldFormat = (filename) => {
    return (
      !isGitignored(filename) &&
      !globber.fileMatchesGlobs(filename, ignoreGlobs)
    );
  };

  // Returns a Promise that resolves with the formatted code
  // or null if it was ignored.
  const formatCode = (filename, code) => {
    return Promise.resolve().then(() => {
      if (!shouldFormat(filename)) {
        return null;
      }
      if (globber.fileMatchesGlobs(filename, prettierGlobs)) {
        return prettifier.format(filename, code);
      }
      if (globber.fileMatchesGlobs(filename, markdownGlobs)) {
        return markdownFormatter.format(filename, code);
      }
      return null;
    });
  };

  // Returns a Promise that resolves with the overwitten filename
  // or null if it was ignored.
  const formatFile = (filename) => {
    return Promise.resolve()
      .then(() => {
        if (!shouldFormat(filename)) {
          return null;
        }
        return pify(fs.readFile)(filename, 'utf8');
      })
      .then((code) => {
        return formatCode(filename, code).then((formattedCode) => {
          if (formattedCode === code) {
            return;
          }
          return pify(fs.writeFile)(filename, formattedCode).then(
            () => filename
          );
        });
      });
  };

  // Returns a Promise that resolves with an array of filenames for the files
  // that were overwritten. Always overwrites files.
  const formatGlobs = (globs) => {
    return globby(globs, {
      ignore: ignoreGlobs,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      return Promise.all(filenames.map(formatFile)).then((results) =>
        results.filter(Boolean)
      );
    });
  };

  return {
    formatCode,
    formatGlobs
  };
}

module.exports = createSticklerFormatter;
