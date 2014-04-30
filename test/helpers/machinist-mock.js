'use strict';
/*!
 * Machinist Mock
 */

/**
 * Module Dependencies
 */

var MachinistMock,
    Machinist = require('../../');

/**
 * MachinistMock
 *
 * @param {Object} sandbox, Sinon Sandbox
 * @return {MachinistMock}
 */

MachinistMock = function (sandbox) {
  var state = Machinist();
  sandbox.spy(state, 'enter');
  sandbox.spy(state, 'exit');
  sandbox.spy(state, 'destroy');
  return state;
};

exports = module.exports = MachinistMock;