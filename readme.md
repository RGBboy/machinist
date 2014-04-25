# Machinist

Simple state machines.

[![Browser Support](https://ci.testling.com/rgbboy/machinist.png)
](https://ci.testling.com/RGBboy/machinist)

[![Build Status](https://secure.travis-ci.org/RGBboy/machinist.png)](http://travis-ci.org/RGBboy/machinist)

# Install

With [npm](http://npmjs.org) do:

```
npm install machinist
```

# Example

``` javascript
  var Machinist = require('machinist'),
      locked = new Machinist.State(),
      unlocked = new Machinist.State(),
      turnstile = new Machinist.Machine(locked);

  turnstile.addTransition('insert coin', locked, unlocked);
  turnstile.addTransition('insert coin', unlocked, unlocked);
  turnstile.addTransition('push', unlocked, locked);
  turnstile.addTransition('push', locked, locked);

  console.log(turnstile.state); // locked
  turnstile.transition('insert coin');
  console.log(turnstile.state); // unlocked
  turnstile.transition('push');
  console.log(turnstile.state); // locked
```

# API

``` javascript
  var Machinist = require('machinist');
```

## var state = Machinist.State()

Create a new State object `state`.

## state.enter()

Signals the State that it is being transitioned in to. You should not need to 
call this as it is taken care of by the Machine.

## state.exit()

Signals the State that it is being transitioned away from. You should not need 
to call this as it is taken care of by the Machine.

## state.destroy()

Destroys the State.

## var machine = Machinist.Machine(initialState)

Create a new Machine object `machine`.

## machine.addTransition(name, from, to)

Creates a valid transition `name` that will switch from the State `from` to 
the State `to`.

Transitions must have a unique `name` and `from` parameters.

## machine.transition(name)

Executes the defined transition `name`. The transition must be added prior to 
being called.

## machine.destroy()

Destroys the Machine.

# Events

## state.on('enter', cb)

This event fires with `cb(state)` when the State is entered.

## state.on('exit', cb)

This event fires with `cb(state)` when the State is exited.

## state.on('destroy', cb)

This event fires with `cb(state)` when the State is destroyed.

Users of a State should listen for the destroy event and clean up any 
references they hold so the State can be garbage collected.

## machine.on('transition', cb)

This event fires with `cb(transitionName, fromState, toState)` when a 
transition is executed.

## machine.on('destroy', cb)

This event fires with `cb(machine)` when the machine is destroyed.

Users of a Machine should listen for the destroy event and clean up any 
references they hold so the Machine can be garbage collected.

Destroying a Machine will not destroy the States it uses. To destroy a State 
you should call `state.destroy()`.

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