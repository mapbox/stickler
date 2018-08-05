'use strict';

const globby = require('globby');
const flatten = require('lodash.flatten');
const micromatch = require('micromatch');
const loadConfig = require('../config/load-config');
const Eslinter = require('./eslinter');
const MarkdownLinter = require('./markdown-linter');

class SticklerLinter {
  constructor(config) {
    this.sticklerConfig = loadConfig(config);
    this.isGitignored = globby.gitignore.sync();
    this.eslinter = new Eslinter(this.sticklerConfig);
    this.markdownLinter = new MarkdownLinter();
    this.eslintGlobs = this.sticklerConfig.jsLint ? ['**/*.{js,jsx}'] : [];
    this.markdownGlobs = this.sticklerConfig.mdLint ? ['**/*.md'] : [];
  }

  shouldLint(filename) {
    return (
      !this.isGitignored(filename) &&
      !micromatch.isMatch(filename, this.sticklerConfig.ignore)
    );
  }

  // All linter functions return an array of ESLint-style results.

  lintCode(filename, code) {
    return Promise.resolve().then(() => {
      if (!this.shouldLint(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, this.eslintGlobs)) {
        return this.eslinter.lintCode(filename, code);
      }
      if (micromatch.isMatch(filename, this.markdownGlobs)) {
        return this.markdownLinter.lintCode(filename, code);
      }
      return null;
    });
  }

  lintFile(filename) {
    return Promise.resolve().then(() => {
      if (!this.shouldLint(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, this.prettierGlobs)) {
        return this.eslinter.lintFile(filename);
      }
      if (micromatch.isMatch(filename, this.markdownGlobs)) {
        return this.markdownLinter.lintFile(filename);
      }
      return null;
    });
  }

  lintGlobs(globs) {
    return globby(globs, {
      ignore: this.sticklerConfig.ignore,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      const lintPromises = [];

      const eslintFilenames = micromatch(filenames, this.eslintGlobs);
      lintPromises.push(this.eslinter.lintFiles(eslintFilenames));

      const mdFilenames = micromatch(filenames, this.markdownGlobs);
      lintPromises.push(this.markdownLinter.lintFiles(mdFilenames));

      return Promise.all(lintPromises).then(flatten);
    });
  }
}

module.exports = SticklerLinter;
