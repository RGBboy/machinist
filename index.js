'use strict';
/*!
 * Machinist
 */

/**
 * Module Dependencies
 */

var Machinist,
    EventEmitter = require('events').EventEmitter;

/**
 * Machinist
 *
 * @api public
 */
Machinist = function (state, cb) {

  var self = new EventEmitter(),
      transitions = {};

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
    throw new Error('state.destroy called on current state.');
  };

  self.setMaxListeners(100);

  /**
   * .state {Machinist}
   *
   * @api public
   */
  self.state = state || null;

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
   * .addTransition
   *
   * @param {String} name
   * @param {Machinist} from
   * @param {Machinist} to
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
    if (from) {
      from.once('destroy', removeTransition);
    };
    if (to) {
      to.once('destroy', removeTransition);
    };
  };

  /**
   * .go
   *
   * @param {String} name
   * @return {undefined}
   * @api public
   */
  self.go = function (name) {
    var transition = findTransition(name, self.state);
    if (!transition) {
      self.emit('transitionnotfound', name);
    } else {
      if (self.state) {
        self.state.exit();
        self.state.removeListener('destroy', throwOnDestroy);
        self.state.removeListener('transitionnotfound', self.go);
      };
      self.state = transition.to;
      if (self.state) {
        self.state.once('destroy', throwOnDestroy);
        self.state.on('transitionnotfound', self.go);
        self.state.enter();
      };
      self.emit('transition', name, transition.from, transition.to);
    };
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
         if (transitions[keys[i]][j].from) {
           delete transitions[keys[i]][j].from;
         };
         if (transitions[keys[i]][j].to) {
           delete transitions[keys[i]][j].to;
         };
         transitions[keys[i]].splice(j, 1);
       };
       delete transitions[keys[i]];
     };
     if (self.state) {
       self.state.removeListener('destroy', throwOnDestroy);
     };
   };

   if (self.state) {
     self.state.once('destroy', throwOnDestroy);
     self.state.on('transitionnotfound', self.go);
     if (cb) {
       cb(self.addTransition);
     };
     self.state.enter();
   } else if (cb) {
     cb(self.addTransition);
   };

  return self;

};

/**
 * Module Exports
 */
exports = module.exports = Machinist;