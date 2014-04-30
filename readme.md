# Machinist

Simple hierarchical state machines.

[![Browser Support](https://ci.testling.com/rgbboy/machinist.png)
](https://ci.testling.com/RGBboy/machinist)

[![Build Status](https://secure.travis-ci.org/RGBboy/machinist.png)](http://travis-ci.org/RGBboy/machinist)

# Install

With [npm](http://npmjs.org) do:

```
npm install machinist
```

# Examples

## Turnstile

``` javascript
  var Machinist = require('machinist'),
      locked = Machinist(),
      unlocked = Machinist(),
      turnstile = Machinist(locked);

  turnstile.addTransition('insert coin', locked, unlocked);
  turnstile.addTransition('insert coin', unlocked, unlocked);
  turnstile.addTransition('push', unlocked, locked);
  turnstile.addTransition('push', locked, locked);

  console.log(turnstile.state); // locked
  turnstile.go('insert coin');
  console.log(turnstile.state); // unlocked
  turnstile.go('push');
  console.log(turnstile.state); // locked
```

## Game State Manager

Machinist creates objects which are both machine and states. This allows you 
to create hierarchical state machines like this Game State Manager:

``` javascript
  var Machinist = require('machinist'),
      menu = Machinist(),
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

  console.log(gameState.state); // menu
  console.log(play.state); // null
  gameState.go('play');
  console.log(gameState.state); // play
  console.log(play.state); // null
  play.go('pause');
  console.log(gameState.state); // play
  console.log(play.state); // pause
  play.go('menu');
  console.log(gameState.state); // menu
  console.log(play.state); // null

```

# API

``` javascript
  var Machinist = require('machinist');
```

## var machine = Machinist(initialState=null)

Create a new Machinist object `machine`.

`machine.state` is set to `initialState`.

## machine.state

Reference to the current state the machine is in.

## machine.addTransition(name, from, to)

Creates a valid transition `name` that will switch from the state `from` to 
the state `to`.

Transitions must have a unique `name` and `from` parameters.

## machine.go(name)

Executes the defined transition `name`. The transition must be added prior to 
being called.

## machine.enter()

Signals the machine that it is being transitioned in to. You should not need to 
call this as it is taken care of internally when `machine.go` is called.

## machine.exit()

Signals the machine that it is being transitioned away from. You should not need 
to call this as it is taken care of internally when `machine.go` is called.

## machine.destroy()

Destroys the machine.

# Events

## state.on('enter', cb)

This event fires with `cb(machine)` when the machine is entered.

## state.on('exit', cb)

This event fires with `cb(machine)` when the machine is exited.

## machine.on('transition', cb)

This event fires with `cb(transitionName, fromState, toState)` when a 
transition is executed.

## machine.on('transitionnotfound', cb)

This event fires with `cb(transitionName)` when a transition is called but 
a valid one does not exist for the machine `go` was called on.

## machine.on('destroy', cb)

This event fires with `cb(machine)` when the machine is destroyed.

Users of a Machine should listen for the destroy event and clean up any 
references they hold so the Machine can be garbage collected.

Destroying a Machine will not destroy the machines it transitions between. To destroy them 
you should call their `destroy` method.

# License 

(The MIT License)

Copyright (c) 2014 RGBboy &lt;l-_-l@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.