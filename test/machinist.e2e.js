'use strict';
/*!
 * Machinist End to End test
 */

;
/**
 * Module Dependencies
 */

var test = require('tape'),
    Machinist = require('../index');

/**
 * Turnstile example
 */

test('Turnstile example', function (t) {

  var locked = new Machinist(),
      unlocked = new Machinist(),
      turnstile = new Machinist(locked);

  turnstile.addTransition('insert coin', locked, unlocked);
  turnstile.addTransition('insert coin', unlocked, unlocked);
  turnstile.addTransition('push', unlocked, locked);
  turnstile.addTransition('push', locked, locked);

  t.plan(5);
  t.ok(turnstile.state === locked, 'turnstile initial state is locked');
  turnstile.go('insert coin');
  t.ok(turnstile.state === unlocked, 'turnstile state is unlocked after insert coin transition');
  turnstile.go('insert coin');
  t.ok(turnstile.state === unlocked, 'turnstile state is unlocked after insert coin transition');
  turnstile.go('push');
  t.ok(turnstile.state === locked, 'turnstile state is locked after push transition');
  turnstile.go('push');
  t.ok(turnstile.state === locked, 'turnstile state is locked after push transition');

  turnstile.destroy();
  locked.destroy();
  unlocked.destroy();

});

test('Game State example', function (t) {

  var menu = Machinist(),
      play = Machinist(),
      pause = Machinist(),
      gameState = Machinist(menu);

  gameState.addTransition('play', menu, play);
  gameState.addTransition('menu', play, menu);

  play.addTransition('pause', null, pause);
  play.addTransition('play', pause, null);

  play.on('exit', function () {
    if (play.state === pause) {
      play.go('play');
    };
  });

  t.plan(8);

  t.equal(gameState.state, menu);
  t.equal(play.state, null);
  gameState.go('play');
  t.equal(gameState.state, play);
  t.equal(play.state, null);
  play.go('pause');
  t.equal(gameState.state, play);
  t.equal(play.state, pause);
  play.go('menu');
  t.equal(gameState.state, menu);
  t.equal(play.state, null);

});