'use strict';

const Eslint = require('eslint');
const path = require('path');
const globber = require('../utils/globber');
const createEslintConfig = require('./create-eslint-config');

// Returns an object that exposes the following functions:
// - lintCode
// - lintFile
// - lintFiles
function createEslinter(sticklerContext) {
  const { jsLint } = sticklerContext.config;
  const eslintCacheDir = path.join(
    sticklerContext.configDir,
    'node_modules/.cache/stickler/'
  );

  // eslintEnginesList is an array of objects, each with the following properties:
  //
  // - engine: An ESLint engine.
  // - files: A glob-array of files that should be linted with this engine.
  const eslintEnginesList = jsLint.map((jsLintItem, index) => {
    const eslintConfig = createEslintConfig(
      sticklerContext,
      jsLintItem.settings
    );
    const engine = createEslintEngine(eslintConfig, eslintCacheDir);
    if (index === jsLint.length - 1 && !jsLintItem.files) {
      return { engine, files: ['**/*'] };
    }
    return { engine, files: jsLintItem.files };
  });

  // Each lint function returns an array of ESLint-style results.

  const lintCode = (filename, code) => {
    return Promise.resolve()
      .then(() => {
        const engine = getEngineForFile(eslintEnginesList, filename);
        return engine.executeOnText(code, filename);
      })
      .then((report) => report.results);
  };

  const lintFiles = (filenames) => {
    return Promise.resolve().then(() => {
      const engineFileMap = mapEnginesToFiles(eslintEnginesList, filenames);

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

// Returns the ESLint engine that should be used for a file.
function getEngineForFile(eslintEnginesList, filename) {
  for (const enginesListItem of eslintEnginesList) {
    if (globber.fileMatchesGlobs(filename, enginesListItem.files)) {
      return enginesListItem.engine;
    }
  }
}

// Returns a Map whose keys are ESLint engines and values are
// files that should be linted with the corresponding engine.
function mapEnginesToFiles(eslintEnginesList, filenames) {
  return filenames.reduce((result, filename) => {
    const engine = getEngineForFile(eslintEnginesList, filename);
    if (result.has(engine)) {
      result.get(engine).push(filename);
    } else {
      result.set(engine, [filename]);
    }
    return result;
  }, new Map());
}

module.exports = createEslinter;
