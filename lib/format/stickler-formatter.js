'use strict';

const micromatch = require('micromatch');
const globby = require('globby');
const pify = require('pify');
const fs = require('fs');
const loadConfig = require('../config/load-config');
const Prettifier = require('./prettifier');
const MarkdownFormatter = require('./markdown-formatter');

const formatIgnoreDefault = ['**/package*.json'];

class SticklerFormatter {
  constructor(rawConfig) {
    const sticklerConfig = loadConfig(rawConfig);

    this.formatIgnoreGlobs = formatIgnoreDefault.concat(sticklerConfig.ignore);
    this.isGitignored = globby.gitignore.sync();

    const prettierExtensions = [];
    if (sticklerConfig.jsFormat) {
      prettierExtensions.push('js', 'jsx');
    }
    if (sticklerConfig.jsonFormat) {
      prettierExtensions.push('json');
    }
    this.prettierGlobs =
      prettierExtensions.length !== 0
        ? [`**/*.{${prettierExtensions.join(',')}}`]
        : [];
    this.markdownGlobs = sticklerConfig.mdFormat ? ['**/*.md'] : [];

    this.prettifier = new Prettifier();
    this.markdownFormatter = new MarkdownFormatter();
  }

  shouldFormat(filename) {
    return (
      !this.isGitignored(filename) &&
      !micromatch.isMatch(filename, this.formatIgnoreGlobs)
    );
  }

  formatCode(filename, code) {
    return Promise.resolve().then(() => {
      if (!this.shouldFormat(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, this.prettierGlobs)) {
        return this.prettifier.format(filename, code);
      }
      if (micromatch.isMatch(filename, this.markdownGlobs)) {
        return this.markdownFormatter.format(filename, code);
      }
      return null;
    });
  }

  formatFile(filename, { overwrite }) {
    return Promise.resolve()
      .then(() => {
        if (!this.shouldFormat(filename)) {
          return null;
        }
        return pify(fs.readFile)(filename, 'utf8');
      })
      .then((code) => {
        return this.formatCode(filename, code).then((formattedCode) => {
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
  }

  formatGlobs(globs, { overwrite }) {
    return globby(globs, {
      ignore: this.formatIgnoreGlobs,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      const formatPromises = filenames.map((filename) => {
        return this.formatFile(filename, { overwrite });
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
  }
}

module.exports = SticklerFormatter;
