'use strict';

const path = require('path');

// Enable dogfooding.
const root = path.join(__dirname, '../..');
const command =
  process.cwd() === root ? path.join(root, 'bin/stickler.js') : 'stickler';

module.exports = {
  '*.{js,json,md}': [`${command} lint`, `${command} format`, 'git add']
};
