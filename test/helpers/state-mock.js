'use strict';
/*!
 * State Mock
 */

/**
 * Module Dependencies
 */

var StateMock,
    State = require('../../lib/state');

/**
 * StateMock
 *
 * @param {Object} sandbox, Sinon Sandbox
 * @return {StateMock}
 */

StateMock = function (sandbox) {
  var state = State();
  sandbox.spy(state, 'enter');
  sandbox.spy(state, 'exit');
  sandbox.spy(state, 'destroy');
  return state;
};

exports = module.exports = StateMock;