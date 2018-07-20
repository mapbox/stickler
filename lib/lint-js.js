'use strict';

const Eslint = require('eslint');
const _ = require('lodash');
const micromatch = require('micromatch');
const createEslintConfig = require('./create-eslint-config');

// sjlc = Stickler lintJs config
// i.e. a sticklerConfig.lintJs value (without "overrides" or "files").

function lintJs(sticklerConfig, filenames) {
  if (sticklerConfig.jsLint === false) {
    return Promise.resolve();
  }

  const sjlcFilenameMap = mapSjlcsToFilenames(sticklerConfig, filenames);
  const reportPromises = [];
  for (const [sjlc, filenames] of sjlcFilenameMap) {
    const eslintConfig = createEslintConfig(sjlc);
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

function mergeConfigs(a, b) {
  const merged = _.merge({}, a, b);
  return merged;
}

// Returns a map whose
// - keys are sticklerConfig.jsLint values
// - values are a Set of filenames
function mapSjlcsToFilenames(sticklerConfig, filenames) {
  const globSljcMap = mapGlobsToSljcs(sticklerConfig);
  const sjlcFilenameMap = new Map();

  // Each entry in sjlcFilenameMap maps a config to a set of filenames.
  for (const config of globSljcMap.values()) {
    sjlcFilenameMap.set(config, new Set());
  }

  for (const filename of filenames) {
    const fileConfig = getConfigForFile(filename, globSljcMap);
    sjlcFilenameMap.get(fileConfig).add(filename);
  }

  return sjlcFilenameMap;
}

// Returns a map whose
// - keys are glob-arrays
// - values are sticklerConfig.jsLint values
function mapGlobsToSljcs(sticklerConfig) {
  const baseSljcs = _.omit(sticklerConfig.jsLint, ['overrides']);
  const globSljcMap = new Map();

  for (const override of sticklerConfig.jsLint.overrides || []) {
    globSljcMap.set(
      override.files,
      mergeConfigs(baseSljcs, _.omit(override, ['files']))
    );
  }

  globSljcMap.set(['**/*.js'], baseSljcs);

  return globSljcMap;
}

function getConfigForFile(filename, globSljcMap) {
  for (const [glob, config] of globSljcMap) {
    if (micromatch.any(filename, glob)) {
      return config;
    }
  }
}

function mergeEslintReports(reports) {
  return reports.reduce((memo, report) => {
    return memo.concat(report.results);
  }, []);
}

module.exports = lintJs;
