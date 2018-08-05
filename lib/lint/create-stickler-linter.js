'use strict';

const globby = require('globby');
const flatten = require('lodash.flatten');
const micromatch = require('micromatch');
const createEslinter = require('./create-eslinter');
const createMarkdownLinter = require('./create-markdown-linter');

function createSticklerLinter(sticklerContext) {
  const { config, isGitignored } = sticklerContext;
  const eslinter = createEslinter(sticklerContext);
  const markdownLinter = createMarkdownLinter();
  const ignoreGlobs = config.ignore;
  const eslintGlobs = config.jsLint ? ['**/*.{js,jsx}'] : [];
  const markdownGlobs = config.mdLint ? ['**/*.md'] : [];

  const shouldLint = (filename) => {
    return (
      !isGitignored(filename) && !micromatch.isMatch(filename, ignoreGlobs)
    );
  };

  // All linter functions return an array of ESLint-style results.

  const lintCode = (filename, code) => {
    return Promise.resolve().then(() => {
      if (!shouldLint(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, eslintGlobs)) {
        return eslinter.lintCode(filename, code);
      }
      if (micromatch.isMatch(filename, markdownGlobs)) {
        return markdownLinter.lintCode(filename, code);
      }
      return null;
    });
  };

  const lintFile = (filename) => {
    return Promise.resolve().then(() => {
      console.log(filename);
      if (!shouldLint(filename)) {
        return null;
      }
      if (micromatch.isMatch(filename, eslintGlobs)) {
        return eslinter.lintFile(filename);
      }
      if (micromatch.isMatch(filename, markdownGlobs)) {
        return markdownLinter.lintFile(filename);
      }
      return null;
    });
  };

  const lintGlobs = (globs) => {
    return globby(globs, {
      ignore: ignoreGlobs,
      gitignore: true,
      absolute: true
    }).then((filenames) => {
      const lintPromises = [];

      const eslintFilenames = micromatch(filenames, eslintGlobs);
      lintPromises.push(eslinter.lintFiles(eslintFilenames));

      const mdFilenames = micromatch(filenames, markdownGlobs);
      lintPromises.push(markdownLinter.lintFiles(mdFilenames));

      return Promise.all(lintPromises).then(flatten);
    });
  };

  return {
    lintCode,
    lintFile,
    lintGlobs
  };
}

module.exports = createSticklerLinter;
