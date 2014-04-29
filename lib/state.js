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

  self.setMaxListeners(100);

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
   * .exit
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