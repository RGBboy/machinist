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
      transitions = {};

  if (!state) {
    throw new Error('Machine expects an initial state.');
  };

  /**
   * .state {State}
   *
   * @api public
   */
  self.state = state;
  self.state.once('destroy', throwOnDestroy);
  self.state.enter();

  function findTransition (name, from) {
    var i;
    if (transitions[name]) {
      for (i = 0; i < transitions[name].length; i += 1) {
        if (transitions[name][i].from === from) {
          return transitions[name][i];
        };
      };
    };
  };

  function throwOnDestroy (state) {
    throw new Error('state.destroy called on machine.state.');
  };

  /**
   * .addTransition
   *
   * @param {String} name
   * @param {State} from
   * @param {State} to
   * @return {undefined}
   * @api public
   */
  self.addTransition = function (name, from, to) {
    var removeTransition,
        transition;
    if (!transitions[name]) {
      transitions[name] = [];
    };
    if (findTransition(name, from)) {
      throw new Error('Transition already added for ' + name);
      return;
    };
    transition = {
      from: from,
      to: to
    };
    transitions[name].push(transition);
    removeTransition = function () {
      var index;
      if (transitions[name]) {
        index = transitions[name].indexOf(transition);
        if (index !== -1) {
          transitions[name].splice(index, 1);
        };
      };
    };
    from.once('destroy', removeTransition);
    to.once('destroy', removeTransition);
  };

  /**
   * .transition
   *
   * @param {String} name
   * @return {undefined}
   * @api public
   */
  self.transition = function (name) {
    var transition = findTransition(name, self.state);
    if (!transition) {
      throw new Error('Invalid transition: ' + name);
      return;
    };
    self.state.exit();
    self.state.removeListener('destroy', throwOnDestroy);
    self.state = transition.to;
    self.state.once('destroy', throwOnDestroy);
    transition.to.enter();
    self.emit('transition', name, transition.from, transition.to);
  };

  /**
   * .destroy
   *
   * @return {undefined}
   * @api public
   */
  self.destroy = function () {
    var i,
        j,
        keys = Object.keys(transitions);
    self.emit('destroy', self);
    self.removeAllListeners();
    // remove transitions
    for (i = keys.length - 1; i >= 0; i -=1) {
      for (j = transitions[keys[i]].length - 1; j >= 0; j -= 1) {
        delete transitions[keys[i]][j].from;
        delete transitions[keys[i]][j].to;
        transitions[keys[i]].splice(j, 1);
      };
      delete transitions[keys[i]];
    };
    self.state.removeListener('destroy', throwOnDestroy);
  };

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = Machine;