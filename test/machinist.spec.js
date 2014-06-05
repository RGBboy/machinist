'use strict';
/*!
 * Machinist unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    sinon = require('sinon'),
    Machinist = require('../index'),
    EventEmitter = require('events').EventEmitter,
    MachinistMock = require('./helpers/machinist-mock'),
    machinist,
    state,
    sandbox;

/**
 * Setup
 */

var setup = function (t) {
  sandbox = sinon.sandbox.create();
  state = MachinistMock(sandbox);
  machinist = Machinist(state);
};

/**
 * Teardown
 */

var teardown = function (t) {
  sandbox.restore();
  machinist.destroy();
};

/**
 * Machinist Class
 */

test('Machinist', function (t) {
  t.plan(1);
  t.ok(Machinist, 'class should exist');
});

/**
 * machinist
 */

test('machinist should be an instance of EventEmitter', function (t) {
  setup();
  t.plan(1);
  t.ok(machinist instanceof EventEmitter, 'instance of EventEmitter');
  teardown();
});

test('when passed an initial state machinist.state should equal state', function (t) {
  setup(t);
  t.plan(1);
  t.equal(machinist.state, state);
  teardown(t);
});

test('when not passed an initial state machinist.state should equal null', function (t) {
  setup(t);
  machinist = new Machinist();
  t.plan(1);
  t.equal(machinist.state, null);
  teardown(t);
});

test('when passed an initial state, state.enter should be called', function (t) {
  setup(t);
  t.plan(1);
  t.ok(state.enter.calledOnce, 'state.enter called once');
  teardown(t);
});

test('when passed an addTransition callback, it should be called before state.enter', function (t) {
  setup(t);
  t.plan(2);
  state = MachinistMock(sandbox);
  machinist = Machinist(state, function () {
    t.notok(state.enter.called, 'state.enter not called');
  });
  t.ok(state.enter.called, 'state.enter called');
  teardown(t);
});

test('when passed an addTransition callback, it should be called with state.addTransition', function (t) {
  var addTransition;
  setup(t);
  t.plan(1);
  state = MachinistMock(sandbox);
  machinist = Machinist(state, function (aAddTransition) {
    addTransition = aAddTransition;
  });
  t.equal(machinist.addTransition, addTransition);
  teardown(t);
});

/**
 * machinist.addTransition
 */

test('machinist.addTransition should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machinist.addTransition, 'function');
  teardown(t);
});

test('machinist.addTransition should throw if name and from state are not unique', function (t) {
  var state2,
      state3;
  setup(t);
  t.plan(1);
  state2 = MachinistMock(sandbox);
  state3 = MachinistMock(sandbox);
  machinist.addTransition('change', state, state2);
  t.throws(function () {
    machinist.addTransition('change', state, state3);
  });
  teardown(t);
});

test('machinist.addTransition should allow transitions from null', function (t) {
  setup(t);
  machinist = Machinist();
  t.plan(3);
  machinist.addTransition('change', null, state);
  machinist.on('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, null);
    t.equal(to, state);
    teardown(t);
  });
  machinist.go('change');
});

test('machinist.addTransition should allow transitions to null', function (t) {
  setup(t);
  t.plan(3);
  machinist.addTransition('change', state, null);
  machinist.on('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, state);
    t.equal(to, null);
    teardown(t);
  });
  machinist.go('change');
});

/**
 * machinist.go
 */

test('machinist.go should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machinist.go, 'function');
  teardown(t);
});

test('machinist.go should execute an valid transition', function (t) {
  var state2;
  setup(t);
  t.plan(2);
  state2 = MachinistMock(sandbox);
  t.equal(machinist.state, state);
  machinist.addTransition('change', state, state2);
  machinist.go('change');
  t.equal(machinist.state, state2);
  teardown(t);
});

test('machinist should emit a transition event when executing a valid transition', function (t) {
  var state2;
  setup(t);
  t.plan(4);
  state2 = MachinistMock(sandbox);
  machinist.addTransition('change', state, state2);
  machinist.on('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, state);
    t.equal(to, state2);
    t.pass('transition event fired');
    teardown(t);
  });
  machinist.go('change');
});

test('machinist should emit a transitionnotfound event when executing an invalid transition', function (t) {
  setup(t);
  t.plan(2);
  machinist.on('transitionnotfound', function (name) {
    t.equal(name, 'change');
    t.pass('transitionnotfound event fired');
    teardown(t);
  });
  machinist.go('change');
});

test('machinist should support the same transition name for different from states', function (t) {
  var state2,
      state3;
  setup(t);
  t.plan(7);
  state2 = MachinistMock(sandbox);
  state3 = MachinistMock(sandbox);
  machinist.addTransition('change', state, state2);
  machinist.addTransition('change', state2, state3);
  machinist.once('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, state);
    t.equal(to, state2);
    machinist.once('transition', function (name, from, to) {
      t.equal(name, 'change');
      t.equal(from, state2);
      t.equal(to, state3);
      t.pass('transition event fired');
      teardown(t);
    });
    machinist.go('change');
  });
  machinist.go('change');
});

test('machinist.go should throw an error when executing an invalid transition', function (t) {
  var state2;
  setup(t);
  t.plan(1);
  state2 = MachinistMock(sandbox);
  machinist.addTransition('change', state2, state);
  machinist.on('transitionnotfound', function (name) {
    t.equal(name, 'change');
    teardown(t);
  });
  machinist.go('change');
});

test('child should trigger machinist transition if transition is not defined in child', function (t) {
  setup(t);
  t.plan(2);
  machinist.addTransition('change', state, null);
  t.equal(machinist.state, state);
  state.go('change');
  t.equal(machinist.state, null);
  teardown(t);
});

/**
 * machinist.enter
 */

test('machinist.enter should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machinist.enter, 'function');
  teardown(t);
});

test('when enter is called, machinist should emit an enter event', function (t) {
  setup(t);
  t.plan(2);
  machinist.on('enter', function (eventState) {
    t.pass('enter event fired');
    t.equal(machinist, eventState);
    teardown(t);
  });
  machinist.enter();
});

/**
 * machinist.exit
 */

test('machinist.exit should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machinist.exit, 'function');
  teardown(t);
});

test('when exit is called, machinist should emit an exit event', function (t) {
  setup(t);
  t.plan(2);
  machinist.on('exit', function (eventState) {
    t.pass('exit event fired');
    t.equal(machinist, eventState);
    teardown(t);
  });
  machinist.exit();
});

/**
 * machinist.destroy
 */

test('machinist.destroy should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machinist.destroy, 'function');
  teardown(t);
});

test('when destroy is called, machinist should emit a destroy event', function (t) {
  setup(t);
  t.plan(2);
  machinist.on('destroy', function (eventState) {
    t.pass('destroy event fired');
    t.equal(machinist, eventState);
  });
  teardown(t);
});

test('when destroy is called, machinist should remove all event listeners', function (t) {
  setup(t);
  t.plan(3);
  machinist.on('enter', function () {});
  machinist.on('exit', function () {});
  machinist.on('destroy', function () {});
  machinist.destroy();
  t.equal(machinist.listeners('enter').length, 0);
  t.equal(machinist.listeners('exit').length, 0);
  t.equal(machinist.listeners('destroy').length, 0);
  teardown(t);
});

test('when destroy is called machinist should remove all transitions', function (t) {
  var state2;
  setup(t);
  t.plan(3);
  state2 = MachinistMock(sandbox);
  machinist.addTransition('change', state, state2);
  machinist.addTransition('change', state2, state);
  machinist.go('change');
  t.equal(machinist.state, state2);
  machinist.go('change');
  t.equal(machinist.state, state);
  machinist.destroy();
  machinist.on('transitionnotfound', function (name) {
    t.equal(name, 'change');
    teardown(t);
  });
  machinist.go('change');
});

test('when destroy is called on state, machinist should remove all related transitions', function (t) {
  var state2;
  setup(t);
  t.plan(2);
  state2 = MachinistMock(sandbox);
  machinist.addTransition('change', state, state2);
  t.equal(machinist.state, state);
  state2.destroy();
  machinist.on('transitionnotfound', function (name) {
    t.equal(name, 'change');
    teardown(t);
  });
  machinist.go('change');
});

test('when destroy is called on the current state, machinist should throw', function (t) {
  setup(t);
  t.plan(1);
  t.throws(state.destroy, 'state.destroy called on machinist.state.');
  teardown(t);
});