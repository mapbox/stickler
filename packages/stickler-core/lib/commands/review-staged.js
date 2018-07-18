'use strict';

const child_process = require('child_process');
const path = require('path');
const resolveBin = require('../resolve-bin');

function reviewStaged() {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = child_process.spawn(
        resolveBin('lint-staged'),
        ['--config', path.resolve(__dirname, '../lint-staged.config.js')],
        { stdio: 'inherit' }
      );
    } catch (error) {
      reject(error);
      return;
    }

    child.on('close', code => {
      resolve(code);
    });
  });
}

module.exports = reviewStaged;
