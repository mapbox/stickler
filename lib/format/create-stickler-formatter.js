'use strict';

const micromatch = require('micromatch');
const globby = require('globby');
const pify = require('pify');
const fs = require('fs');
const createPrettifier = require('./create-prettifier');
const createMarkdownFormatter = require('./create-markdown-formatter');

const formatIgnoreDefault = ['**/package*.json'];

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
      !isGitignored(filename) && !micromatch.isMatch(filename, ignoreGlobs)
    );
  };

  const formatCode = (filename, code) => {
    return Promise.resolve().then(() => {
      if (!shouldFormat(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, prettierGlobs)) {
        return prettifier.format(filename, code);
      }
      if (micromatch.isMatch(filename, markdownGlobs)) {
        return markdownFormatter.format(filename, code);
      }
      return null;
    });
  };

  const formatFile = (filename, { overwrite }) => {
    return Promise.resolve()
      .then(() => {
        if (!shouldFormat(filename)) {
          return null;
        }
        return pify(fs.readFile)(filename, 'utf8');
      })
      .then((code) => {
        return formatCode(filename, code).then((formattedCode) => {
          if (!overwrite) {
            return formattedCode;
          }
          if (formattedCode === code) {
            return;
          }
          return pify(fs.writeFile)(filename, formattedCode).then(
            () => filename
          );
        });
      });
  };

  const formatGlobs = (globs, { overwrite }) => {
    return globby(globs, {
      ignore: ignoreGlobs,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      const formatPromises = filenames.map((filename) => {
        return formatFile(filename, { overwrite });
      });
      return Promise.all(formatPromises)
        .then((results) => results.filter(Boolean))
        .then((results) => {
          if (overwrite) {
            return results;
          }
          return results.map((filename, index) => {
            return {
              filename,
              result: results[index]
            };
          });
        });
    });
  };

  return {
    formatCode,
    formatFile,
    formatGlobs
  };
}

module.exports = createSticklerFormatter;
