'use strict';
/*!
 * State Mock
 */

/**
 * Module Dependencies
 */

var StateMock;

/**
 * StateMock
 *
 * @param {Object} sandbox, Sinon Sandbox
 * @return {StateMock}
 */

StateMock = function (sandbox) {
  var state = sandbox.stub();
  state.enter = sandbox.stub();
  state.exit = sandbox.stub();
  state.destroy = sandbox.stub();
  return state;
};

exports = module.exports = StateMock;