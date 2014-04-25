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

/**
 * machine.transition
 */

test('machine.transition should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof machine.transition, 'function');
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