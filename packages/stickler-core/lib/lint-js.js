'use strict';

const Eslint = require('eslint');
const _ = require('lodash');
const micromatch = require('micromatch');
const globby = require('globby');
const createEslintConfig = require('./create-eslint-config');

const defaultIgnoreGlob = [
  '**/node_modules/**',
  'coverage/**',
  '**/*.min.js',
  'vendor/**',
  'dist/**'
];

function lint(globs, sticklerConfig = {}) {
  const ignoreGlob = defaultIgnoreGlob.concat(sticklerConfig.ignore).filter(Boolean);
  return globby(globs, {
    ignore: ignoreGlob,
    gitignore: true
  })
    .then(filenames => {
      const configFilenamesMap = mapConfigsToFilenames(
        filenames,
        sticklerConfig
      );
      const reportPromises = [];
      for (const [config, filenames] of configFilenamesMap) {
        const eslintConfig = createEslintConfig(config.jsLint);
        reportPromises.push(runEslintOnFiles(eslintConfig, Array.from(filenames)));
      }
      return Promise.all(reportPromises);
    })
    .then(mergeEslintReports);
}

function runEslintOnFiles(eslintConfig, filenames) {
  const eslintEngine = new Eslint.CLIEngine({
    baseConfig: eslintConfig,
    useEslintrc: false
  });
  return eslintEngine.executeOnFiles(filenames);
}

function mapGlobsToConfigs(sticklerConfig) {
  const baseConfig = _.omit(sticklerConfig, ['overrides']);
  const globConfigMap = new Map();

  for (const override of sticklerConfig.overrides || []) {
    globConfigMap.set(
      override.files,
      mergeConfigs(_.omit(override, ['files']), baseConfig)
    );
  }

  globConfigMap.set(['**/*.{js,jsx,mjs}'], baseConfig);

  return globConfigMap;
}

function mergeConfigs(a, b) {
  return Object.assign({}, a, b, {
    jsLint: Object.assign({}, a.jsLint, b.jsLint)
  });
}

function getConfigForFile(filename, globConfigMap) {
  for (const [glob, config] of globConfigMap) {
    if (micromatch.any(filename, glob)) {
      return config;
    }
  }
}

function mapConfigsToFilenames(filenames, sticklerConfig) {
  const globConfigMap = mapGlobsToConfigs(sticklerConfig);
  const configFilenamesMap = new Map();

  // Each entry in configFilenamesMap maps a config to a set of filenames.
  for (const config of globConfigMap.values()) {
    configFilenamesMap.set(config, new Set());
  }

  for (const filename of filenames) {
    const fileConfig = getConfigForFile(filename, globConfigMap);
    configFilenamesMap.get(fileConfig).add(filename);
  }
  return configFilenamesMap;
}

function mergeEslintReports(reports) {
  return reports.reduce((memo, report) => {
    return memo.concat(report.results);
  }, []);
}

module.exports = lint;
