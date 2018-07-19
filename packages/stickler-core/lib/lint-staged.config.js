'use strict';

const path = require('path');

const command =
  process.cwd() === path.resolve(__dirname, '../../../')
    ? path.resolve(__dirname, '../bin/stickler.js')
    : 'stickler';

module.exports = {
  '*.{js,json,md}': [`${command} lint`, `${command} format`, 'git add']
};
