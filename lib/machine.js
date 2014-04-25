'use strict';
/*!
 * Machine
 */

/**
 * Module Dependencies
 */

var Machine,
    EventEmitter = require('events').EventEmitter;

/**
 * Machine
 *
 * @api public
 */
Machine = function (state) {

  var self = new EventEmitter(),
      states = {};

  /**
   * .state {State}
   *
   * @api public
   */
  self.state = state || null;

  if (self.state) {
    self.state.enter();
  };

  /**
   * .addTransition
   *
   * @param {String} name
   * @param {State} fromState
   * @param {State} toState
   * @return {undefined}
   * @api public
   */
  self.addTransition = function (name, fromState, toState) {
    
  };

  /**
   * .transition
   *
   * @param {String} name
   * @return {undefined}
   * @api public
   */
  self.transition = function (name) {

  };

  /**
   * .destroy
   *
   * @return {undefined}
   * @api public
   */
  self.destroy = function () {
    self.emit('destroy', self);
    self.removeAllListeners();
  };

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = Machine;