'use strict';

const micromatch = require('micromatch');

// This is just a wrapper around micromatch's API, because it's a pretty
// confusing API.

const micromatchOptions = {
  dot: true
};

function fileMatchesGlobs(file, globs) {
  return micromatch.any(file, globs, micromatchOptions);
}

function getFilesMatchingGlobs(files, globs) {
  return micromatch(files, globs, micromatchOptions);
}

module.exports = {
  fileMatchesGlobs,
  getFilesMatchingGlobs
};
