'use strict';
/*!
 * State
 */

/**
 * Module Dependencies
 */

var State,
    EventEmitter = require('events').EventEmitter;

/**
 * State
 *
 * @api public
 */
State = function () {

  var self = new EventEmitter();

  /**
   * .enter
   *
   * @return {undefined}
   * @api public
   */
  self.enter = function () {
    self.emit('enter', self);
  };

  /**
   * .leave
   *
   * @return {undefined}
   * @api public
   */
  self.exit = function () {
    self.emit('exit', self);
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
exports = module.exports = State;