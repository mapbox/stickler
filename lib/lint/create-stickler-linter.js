'use strict';

const globby = require('globby');
const flatten = require('lodash.flatten');
const globber = require('../utils/globber');
const createEslinter = require('./create-eslinter');
const createMarkdownLinter = require('./create-markdown-linter');

// Creates a linter object that exposes the following functions:
// - lintCode
// - lintGlobs
function createSticklerLinter(sticklerContext) {
  const { config, isGitignored } = sticklerContext;
  const eslinter = createEslinter(sticklerContext);
  const markdownLinter = createMarkdownLinter();
  const ignoreGlobs = config.ignore;
  const eslintGlobs = config.jsLint ? ['**/*.{js,jsx}'] : [];
  const markdownGlobs = config.mdLint ? ['**/*.md'] : [];

  const shouldLint = (filename) => {
    return (
      !isGitignored(filename) &&
      !globber.fileMatchesGlobs(filename, ignoreGlobs)
    );
  };

  // Returns a Promise that resolves with an array of ESLint-style results
  // or null if the code was ignored.
  const lintCode = (filename, code) => {
    return Promise.resolve().then(() => {
      if (!shouldLint(filename)) {
        return null;
      }
      if (globber.fileMatchesGlobs(filename, eslintGlobs)) {
        return eslinter.lintCode(filename, code);
      }
      if (globber.fileMatchesGlobs(filename, markdownGlobs)) {
        return markdownLinter.lintCode(filename, code);
      }
      return null;
    });
  };

  // Returns a Promise that resolves with an array of ESLint-style results
  const lintGlobs = (globs) => {
    return globby(globs, {
      ignore: ignoreGlobs,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      const lintPromises = [];

      const eslintFilenames = globber
        .getFilesMatchingGlobs(filenames, eslintGlobs)
        .filter(shouldLint);
      lintPromises.push(eslinter.lintFiles(eslintFilenames));

      const mdFilenames = globber
        .getFilesMatchingGlobs(filenames, markdownGlobs)
        .filter(shouldLint);
      lintPromises.push(markdownLinter.lintFiles(mdFilenames));

      return Promise.all(lintPromises).then(flatten);
    });
  };

  return {
    lintCode,
    lintGlobs
  };
}

module.exports = createSticklerLinter;
