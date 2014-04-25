'use strict';
/*!
 * Machinist unit tests
 */

/**
 * Module Dependencies
 */

var test = require('tape'),
    Machinist = require('../index'),
    Machine = require('../lib/machine'),
    State = require('../lib/state');

/**
 * Setup
 */

var setup = function (t) {
  
};

/**
 * Teardown
 */

var teardown = function (t) {
  
};

/**
 * Machinist Class
 */

test('Machinist', function (t) {
  t.plan(1);
  t.ok(Machinist, 'class should exist');
});

test('Machinist.Machine  should equal the Machine class', function (t) {
  t.plan(1);
  t.equal(Machinist.Machine, Machine);
});

test('Machinist.State should equal the State class', function (t) {
  t.plan(1);
  t.equal(Machinist.State, State);
});