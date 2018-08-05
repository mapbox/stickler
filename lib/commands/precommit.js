'use strict';

const SticklerPrecommitter = require('../precommit/stickler-precommitter');

function precommit() {
  const precommitter = new SticklerPrecommitter();
  return precommitter.precommit();
}

module.exports = precommit;
