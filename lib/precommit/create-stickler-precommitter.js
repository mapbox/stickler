'use strict';

const child_process = require('child_process');
const path = require('path');
const resolveBin = require('./resolve-bin');

const lintStagedConfigPath = path.resolve(__dirname, './lint-staged.config.js');
const lintStagedBin = resolveBin('lint-staged');

// Returns an object with the following properties:
// - errored: A boolean indicating whether the hook errored.
function createSticklerPrecommiter() {
  const precommit = () => {
    return new Promise((resolve, reject) => {
      let child;
      try {
        child = child_process.spawn(
          lintStagedBin,
          ['--config', lintStagedConfigPath],
          { stdio: 'inherit' }
        );
      } catch (error) {
        reject(error);
        return;
      }

      child.on('close', (code) => {
        resolve({ errored: code !== 0 });
      });
      child.on('error', reject);
    });
  };

  return {
    precommit
  };
}

module.exports = createSticklerPrecommiter;
