'use strict';

const Eslint = require('eslint');
const path = require('path');
const micromatch = require('micromatch');
const relativePath = require('../utils/relative-path');
const createEslintConfig = require('./create-eslint-config');

function createEslinter(sticklerContext) {
  const eslintCacheDir = path.join(
    sticklerContext.configDir,
    'node_modules/.cache/stickler/'
  );
  const relativize = relativePath(sticklerContext.cwd);

  const { jsLint } = sticklerContext.config;

  // An array of objects, each with the following properties:
  //
  // - engine: An ESLint engine.
  // - files: A glob-array of files that should be linted with this engine.
  const eslintEnginesList = jsLint.map((jsLintItem, index) => {
    const eslintConfig = createEslintConfig({
      jsLintSettings: jsLintItem.settings,
      includeJestOverrides: sticklerContext.projectUsesJest
    });
    const engine = createEslintEngine(eslintConfig, eslintCacheDir);
    if (index === jsLint.length - 1 && !jsLintItem.files) {
      return { engine, files: ['**/*'] };
    }
    return { engine, files: jsLintItem.files };
  });

  // Returns the ESLint engine that should be used for a file.
  const getEngineForFile = (filename) => {
    return eslintEnginesList.reduce((result, enginesListItem) => {
      if (!micromatch.any(filename, enginesListItem.files)) {
        return result;
      }

      // If we already found settings for this file, there's been a mistake.
      if (result) {
        throw new Error(
          `Stickler config error: ${relativize(
            filename
          )} matches multiple jsLint items`
        );
      }

      result = enginesListItem.engine;
      return result;
    }, undefined);
  };

  // Returns a Map whose keys are ESLint engines and values are
  // files that should be linted with the corresponding engine.
  const mapEnginesToFiles = (filenames) => {
    return filenames.reduce((result, filename) => {
      const engine = getEngineForFile(filename);
      if (result.has(engine)) {
        result.get(engine).push(filename);
      } else {
        result.set(engine, [filename]);
      }
      return result;
    }, new Map());
  };

  // Each lint function returns an array of ESLint-style results.

  const lintCode = (filename, code) => {
    return Promise.resolve()
      .then(() => {
        const engine = getEngineForFile(filename);
        return engine.executeOnText(code, filename);
      })
      .then((report) => report.results);
  };

  const lintFiles = (filenames) => {
    return Promise.resolve().then(() => {
      const engineFileMap = mapEnginesToFiles(filenames);

      const reports = [];
      for (const [engine, engineFilenames] of engineFileMap) {
        reports.push(engine.executeOnFiles(engineFilenames));
      }
      return mergeEslintReports(reports);
    });
  };

  const lintFile = (filename) => {
    return lintFiles([filename]);
  };

  return {
    lintCode,
    lintFile,
    lintFiles
  };
}

function mergeEslintReports(reports) {
  return reports.reduce((memo, report) => {
    return memo.concat(report.results);
  }, []);
}

function createEslintEngine(eslintConfig, eslintCacheDir) {
  return new Eslint.CLIEngine({
    baseConfig: eslintConfig,
    useEslintrc: false,
    globInputPaths: false,
    ignore: false,
    cache: true,
    cacheLocation: eslintCacheDir
  });
}

module.exports = createEslinter;
