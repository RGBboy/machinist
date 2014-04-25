'use strict';
/*!
 * State unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    State = require('../lib/state'),
    EventEmitter = require('events').EventEmitter,
    state;

/**
 * Setup
 */

var setup = function (t) {
  state = new State();
};

/**
 * Teardown
 */

var teardown = function (t) {
  
};

/**
 * State Class
 */

test('State', function (t) {
  t.plan(1);
  t.ok(State, 'class should exist');
});

/**
 * state
 */

test('state should be an instance of EventEmitter', function (t) {
  setup(t);
  t.plan(1);
  t.ok(state instanceof EventEmitter, 'instance of EventEmitter');
  teardown(t);
});

/**
 * state.enter
 */

test('state.enter should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof state.enter, 'function');
  teardown(t);
});

test('state should emit an enter event when enter is called', function (t) {
  setup(t);
  t.plan(2);
  state.on('enter', function (eventState) {
    t.pass('enter event fired');
    t.equal(state, eventState);
    teardown(t);
  });
  state.enter();
});

/**
 * state.exit
 */

test('state.exit should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof state.exit, 'function');
  teardown(t);
});

test('state should emit an exit event when exit is called', function (t) {
  setup(t);
  t.plan(2);
  state.on('exit', function (eventState) {
    t.pass('exit event fired');
    t.equal(state, eventState);
    teardown(t);
  });
  state.exit();
});

/**
 * state.destroy
 */

test('state.destroy should be a function', function (t) {
  setup(t);
  t.plan(1);
  t.equal(typeof state.destroy, 'function');
  teardown(t);
});

test('state should emit an destroy event when exit is called', function (t) {
  setup(t);
  t.plan(2);
  state.on('destroy', function (eventState) {
    t.pass('destroy event fired');
    t.equal(state, eventState);
    teardown(t);
  });
  state.destroy();
});

test('state should remove all event listeners when exit is called', function (t) {
  setup(t);
  state.on('test', function () {
    t.fail('test event fired');
  });
  state.destroy();
  state.emit('test');
  t.end();
  teardown(t);
});