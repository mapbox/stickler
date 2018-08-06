'use strict';

const createSticklerPrecommitter = require('../precommit/create-stickler-precommitter');

function precommit() {
  const precommitter = createSticklerPrecommitter();
  return precommitter.precommit();
}

module.exports = precommit;
