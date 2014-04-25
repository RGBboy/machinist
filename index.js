'use strict';
/*!
 * Machinist
 */

/**
 * Module Dependencies
 */

var Machinist,
    Machine = require('./lib/machine'),
    State = require('./lib/state');

/**
 * Machinist
 *
 * @api public
 */
Machinist = {
  Machine: Machine,
  State: State
};

/**
 * Module Exports
 */
exports = module.exports = Machinist;