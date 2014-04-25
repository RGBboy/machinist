'use strict';
/*!
 * Machinist End to End test
 */

;
/**
 * Module Dependencies
 */

var test = require('tape'),
    Machinist = require('../index'),
    locked,
    unlocked,
    turnstile;

/**
 * Setup
 */

var setup = function (t) {
  locked = new Machinist.State(),
  unlocked = new Machinist.State(),
  turnstile = new Machinist.Machine(locked);
  turnstile.addTransition('insert coin', locked, unlocked);
  turnstile.addTransition('insert coin', unlocked, unlocked);
  turnstile.addTransition('push', unlocked, locked);
  turnstile.addTransition('push', locked, locked);
};

/**
 * Teardown
 */

var teardown = function (t) {
  turnstile.destroy();
  locked.destroy();
  unlocked.destroy();
};

/**
 * Turnstile example
 */

test('Turnstile example', function (t) {
  setup(t);
  t.plan(5);
  t.ok(turnstile.state === locked, 'turnstile initial state is locked');
  turnstyle.transition('insert coin');
  t.ok(turnstile.state === unlocked, 'turnstile state is unlocked after insert coin transition');
  turnstyle.transition('insert coin');
  t.ok(turnstile.state === unlocked, 'turnstile state is unlocked after insert coin transition');
  turnstyle.transition('push');
  t.ok(turnstile.state === locked, 'turnstile state is locked after push transition');
  turnstyle.transition('push');
  t.ok(turnstile.state === locked, 'turnstile state is locked after push transition');
  teardown(t);
});