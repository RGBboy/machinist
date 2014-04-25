'use strict';
/*!
 * Machine unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    sinon = require('sinon'),
    EventEmitter = require('events').EventEmitter,
    Machine = require('../lib/machine'),
    StateMock = require('./helpers/state-mock'),
    machine,
    state,
    sandbox;

/**
 * Setup
 */

var setup = function (t) {
  sandbox = sinon.sandbox.create();
  state = StateMock(sandbox);
  machine = new Machine();
};

/**
 * Teardown
 */

var teardown = function (t) {
  sandbox.restore();
};

/**
 * Machine Class
 */

test('Machine', function (t) {
  t.plan(1);
  t.ok(Machine, 'class should exist');
});

/**
 * machine
 */

test('machine should be an instance of EventEmitter', function (t) {
  setup(t);
  t.plan(1);
  t.ok(machine instanceof EventEmitter, 'instance of EventEmitter');
  teardown(t);
});

test('when not passed an initial state machine.state should equal null', function (t) {
  setup(t);
  t.plan(1);
  t.equal(machine.state, null);
  teardown(t);
});

test('when passed an initial state machine.state should equal state', function (t) {
  setup(t);
  t.plan(1);
  machine = new Machine(state);
  t.equal(machine.state, state);
  teardown(t);
});

test('when passed an initial state, state.enter should be called', function (t) {
  setup(t);
  t.plan(1);
  machine = new Machine(state);
  t.ok(state.enter.calledOnce, 'state.enter called once');
  teardown(t);
});

/**
 * machine.addTransition
 */

test('machine.addTransition should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machine.addTransition, 'function');
  teardown(t);
});

test('machine.addTransition should throw if name and from state are not unique', function (t) {
  var state2,
      state3;
  setup(t);
  t.plan(1);
  state2 = StateMock(sandbox);
  state3 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state, state2);
  t.throws(function () {
    machine.addTransition('change', state, state3);
  });
  teardown(t);
});

/**
 * machine.transition
 */

test('machine.transition should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machine.transition, 'function');
  teardown(t);
});

test('machine.transition should execute an valid transition', function (t) {
  var state2;
  setup(t);
  t.plan(2);
  state2 = StateMock(sandbox);
  machine = new Machine(state);
  t.equal(machine.state, state);
  machine.addTransition('change', state, state2);
  machine.transition('change');
  t.equal(machine.state, state2);
  teardown(t);
});

test('machine should emit a transition event when executing a valid transition', function (t) {
  var state2;
  setup(t);
  t.plan(4);
  state2 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state, state2);
  machine.on('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, state);
    t.equal(to, state2);
    t.pass('transition event fired');
    teardown(t);
  });
  machine.transition('change');
});

test('machine should support the same transition name for different from states', function (t) {
  var state2,
      state3;
  setup(t);
  t.plan(7);
  state2 = StateMock(sandbox);
  state3 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state, state2);
  machine.addTransition('change', state2, state3);
  machine.once('transition', function (name, from, to) {
    t.equal(name, 'change');
    t.equal(from, state);
    t.equal(to, state2);
    machine.once('transition', function (name, from, to) {
      t.equal(name, 'change');
      t.equal(from, state2);
      t.equal(to, state3);
      t.pass('transition event fired');
      teardown(t);
    });
    machine.transition('change');
  });
  machine.transition('change');
});

test('machine.transition should throw an error when executing an invalid transition', function (t) {
  var state2;
  setup(t);
  t.plan(1);
  state2 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state2, state);
  t.throws(function () {
    machine.transition('change');
  }, 'Invalid transition: change');
  teardown(t);
});

/**
 * machine.destroy
 */

test('machine.destroy should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machine.destroy, 'function');
  teardown(t);
});

test('when destroy is called machine should emit an destroy event', function (t) {
  setup(t);
  t.plan(2);
  machine.on('destroy', function (eventMachine) {
    t.pass('destroy event fired');
    t.equal(machine, eventMachine);
    teardown(t);
  });
  machine.destroy();
});

test('when destroy is called machine should remove all event listeners', function (t) {
  setup(t);
  machine.on('test', function () {
    t.fail('test event fired');
  });
  machine.destroy();
  machine.emit('test');
  t.end();
  teardown(t);
});

test('when destroy is called machine should remove all transitions', function (t) {
  var state2;
  setup(t);
  t.plan(3);
  state2 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state, state2);
  machine.addTransition('change', state2, state);
  machine.transition('change');
  t.equal(machine.state, state2);
  machine.transition('change');
  t.equal(machine.state, state);
  machine.destroy();
  t.throws(function () {
    machine.transition('change');
  }, 'Invalid transition: change');
  teardown(t);
});

test('when destroy is called on state, machine should remove all related transitions', function (t) {
  var state2;
  setup(t);
  t.plan(2);
  state2 = StateMock(sandbox);
  machine = new Machine(state);
  machine.addTransition('change', state, state2);
  t.equal(machine.state, state);
  state2.destroy();
  t.throws(function () {
    machine.transition('change');
  }, 'Invalid transition: change');
  teardown(t);
});

test('when destroy is called on the current state, machine should call state.exit and set machine.state to null', function (t) {
  setup(t);
  t.plan(2);
  machine = new Machine(state);
  state.destroy();
  t.ok(state.exit.calledOnce, 'state.exit called once');
  t.equal(machine.state, null);
  teardown(t);
});