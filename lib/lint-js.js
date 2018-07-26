'use strict';

const Eslint = require('eslint');
const path = require('path');
const micromatch = require('micromatch');
const createEslintConfig = require('./create-eslint-config');

// jls = jsLint settings

function lintJs(sticklerConfig, filenames) {
  if (sticklerConfig.jsLint === false) {
    return Promise.resolve();
  }

  const jlsFilenameMap = mapJlsToFilenames(sticklerConfig, filenames);
  const reportPromises = [];
  for (const [jls, filenames] of jlsFilenameMap) {
    const eslintConfig = createEslintConfig(jls);
    reportPromises.push(runEslintOnFiles(eslintConfig, Array.from(filenames)));
  }
  return Promise.all(reportPromises).then(mergeEslintReports);
}

function runEslintOnFiles(eslintConfig, filenames) {
  const eslintEngine = new Eslint.CLIEngine({
    baseConfig: eslintConfig,
    useEslintrc: false,
    ignore: false
  });
  return eslintEngine.executeOnFiles(filenames);
}

// Returns a map whose
// - keys are jsLint settings objects
// - values are Sets of filenames
function mapJlsToFilenames(sticklerConfig, filenames) {
  const jlsFilenameMap = new Map();

  for (const jsLintItem of sticklerConfig.jsLint) {
    jlsFilenameMap.set(jsLintItem.settings, new Set());
  }

  for (const filename of filenames) {
    const fileSettings = getSettingsForFile(sticklerConfig.jsLint, filename);
    jlsFilenameMap.get(fileSettings).add(filename);
  }

  return jlsFilenameMap;
}

function getSettingsForFile(jsLintArray, filename) {
  let settings;
  jsLintArray.forEach((jsLintItem, index) => {
    // Deal with fallbacks: must be the last item in the array and have no files properties.
    if (!jsLintItem.files && index === jsLintArray.length - 1) {
      if (!settings) {
        settings = jsLintItem.settings;
      }
      return;
    }

    if (!micromatch.any(filename, jsLintItem.files)) {
      return;
    }

    // If we already found settings for this file, there's been a mistake.
    if (settings) {
      throw new Error(
        `Stickler config error: ${path.relative(
          process.cwd(),
          filename
        )} matches multiple jsLint items`
      );
    }

    settings = jsLintItem.settings;
  });
  return settings;
}

function mergeEslintReports(reports) {
  return reports.reduce((memo, report) => {
    return memo.concat(report.results);
  }, []);
}

module.exports = lintJs;
