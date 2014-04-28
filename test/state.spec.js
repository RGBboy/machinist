'use strict';
/*!
 * State unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    EventEmitter = require('events').EventEmitter,
    State = require('../lib/state'),
    state;

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
  state = new State();
  t.plan(1);
  t.ok(state instanceof EventEmitter, 'instance of EventEmitter');
  state.destroy();
});

/**
 * state.enter
 */

test('state.enter should be a function', function (t) {
  state = new State();
  t.plan(1);
  t.equal(typeof state.enter, 'function');
  state.destroy();
});

test('when enter is called, state should emit an enter event', function (t) {
  state = new State();
  t.plan(2);
  state.on('enter', function (eventState) {
    t.pass('enter event fired');
    t.equal(state, eventState);
    state.destroy();
  });
  state.enter();
});

/**
 * state.exit
 */

test('state.exit should be a function', function (t) {
  state = new State();
  t.plan(1);
  t.equal(typeof state.exit, 'function');
  state.destroy();
});

test('when exit is called, state should emit an exit event', function (t) {
  state = new State();
  t.plan(2);
  state.on('exit', function (eventState) {
    t.pass('exit event fired');
    t.equal(state, eventState);
    state.destroy();
  });
  state.exit();
});

/**
 * state.destroy
 */

test('state.destroy should be a function', function (t) {
  state = new State();
  t.plan(1);
  t.equal(typeof state.destroy, 'function');
  state.destroy();
});

test('when destroy is called, state should emit a destroy event', function (t) {
  state = new State();
  t.plan(2);
  state.on('destroy', function (eventState) {
    t.pass('destroy event fired');
    t.equal(state, eventState);
  });
  state.destroy();
});

test('when destroy is called, state should remove all event listeners', function (t) {
  state = new State();
  t.plan(3);
  state.on('enter', function () {});
  state.on('exit', function () {});
  state.on('destroy', function () {});
  state.destroy();
  t.equal(state.listeners('enter').length, 0);
  t.equal(state.listeners('exit').length, 0);
  t.equal(state.listeners('destroy').length, 0);
  t.end();
});