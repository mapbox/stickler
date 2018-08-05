'use strict';

const path = require('path');
const normalizeConfig = require('./normalize-config');

/**
 * Load, validate, and normalize the Stickler configuration.
 *
 * @param {Object} options
 * @param {config} [rawConfig] - If no config is provided, Stickler will
 *   look for a config file in cwd.
 * @returns {SticklerConfig}
 */
function loadConfig(rawConfig) {
  if (!rawConfig) {
    try {
      rawConfig = require(path.join(process.cwd(), 'stickler.config.js'));
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
      }
    }
  }

  return normalizeConfig(rawConfig);
}

module.exports = loadConfig;
