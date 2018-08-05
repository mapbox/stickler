'use strict';

const Eslint = require('eslint');
const path = require('path');
const micromatch = require('micromatch');
const createEslintConfig = require('./create-eslint-config');

// jls = jsLint settings

const eslintCacheDir = path.join(
  process.cwd(),
  'node_modules/.cache/stickler/'
);

class Eslinter {
  constructor(sticklerConfig) {
    this.eslintEnginesList = createEnginesList(sticklerConfig);
  }

  // Each lint function returns an array of ESLint results.

  lintCode(filename, code) {
    return Promise.resolve()
      .then(() => {
        const engine = this.getEngineForFile(filename);
        return engine.executeOnText(code, filename);
      })
      .then((report) => report.results);
  }

  lintFile(filename) {
    return this.lintFiles([filename]);
  }

  lintFiles(filenames) {
    return Promise.resolve().then(() => {
      const engineFileMap = this.mapEnginesToFiles(filenames);

      const reports = [];
      for (const [engine, engineFilenames] of engineFileMap) {
        reports.push(engine.executeOnFiles(engineFilenames));
      }
      return mergeEslintReports(reports);
    });
  }

  /**
   * Returns a Map whose keys are ESLint engines and values are
   * files that should be linted with the corresponding engine.
   *
   * @param {Array<string>} filenames
   * @returns {Map<ESLintEngine, Array<string>>}
   */
  mapEnginesToFiles(filenames) {
    return filenames.reduce((result, filename) => {
      const engine = this.getEngineForFile(filename);
      if (result.has(engine)) {
        result.get(engine).push(filename);
      } else {
        result.set(engine, [filename]);
      }
      return result;
    }, new Map());
  }

  /**
   * Returns the ESLint engine that should be used for a file.
   *
   * @param {string} filename
   * @returns {ESLintEngine}
   */
  getEngineForFile(filename) {
    return this.eslintEnginesList.reduce((result, enginesListItem) => {
      if (!micromatch.any(filename, enginesListItem.files)) {
        return result;
      }

      // If we already found settings for this file, there's been a mistake.
      if (result) {
        throw new Error(
          `Stickler config error: ${path.relative(
            process.cwd(),
            filename
          )} matches multiple jsLint items`
        );
      }

      result = enginesListItem.engine;
      return result;
    }, undefined);
  }
}

/**
 * Returns an array of objects, each with the following properties:
 *
 * - engine: An ESLint engine.
 * - files: A glob-array of files that should be linted with this engine.
 *
 * @param {SticklerConfig} sticklerConfig
 * @returns {Array<Object>}
 */
function createEnginesList(sticklerConfig) {
  return sticklerConfig.jsLint.map((jsLintItem, index) => {
    const eslintConfig = createEslintConfig(jsLintItem.settings);
    const engine = createEslintEngine(eslintConfig);
    if (index === sticklerConfig.jsLint.length - 1 && !jsLintItem.files) {
      return { engine, files: ['**/*'] };
    }
    return { engine, files: jsLintItem.files };
  });
}

function createEslintEngine(eslintConfig) {
  return new Eslint.CLIEngine({
    baseConfig: eslintConfig,
    useEslintrc: false,
    globInputPaths: false,
    ignore: false,
    cache: true,
    cacheLocation: eslintCacheDir
  });
}

function mergeEslintReports(reports) {
  return reports.reduce((memo, report) => {
    return memo.concat(report.results);
  }, []);
}

module.exports = Eslinter;
