# prominator
[![npm package](https://badge.fury.io/js/prominator.svg)](http://badge.fury.io/js/prominator)
[![build](https://travis-ci.org/bakerface/prominator.svg?branch=master)](https://travis-ci.org/bakerface/prominator)
[![code climate](https://codeclimate.com/github/bakerface/prominator/badges/gpa.svg)](https://codeclimate.com/github/bakerface/prominator)
[![coverage](https://codeclimate.com/github/bakerface/prominator/badges/coverage.svg)](https://codeclimate.com/github/bakerface/prominator/coverage)
[![issues](https://img.shields.io/github/issues/bakerface/prominator.svg)](https://github.com/bakerface/prominator/issues)
[![dependencies](https://david-dm.org/bakerface/prominator.svg)](https://david-dm.org/bakerface/prominator)
[![devDependencies](https://david-dm.org/bakerface/prominator/dev-status.svg)](https://david-dm.org/bakerface/prominator#info=devDependencies)

### Table of Contents
-  [catchIf](#catchifpredicate-fn)(*predicate*, *fn*) - catch an error if a condition is met
-  [expect](#expectmodifiers-predicate)(*...modifiers*, *predicate*) - expect a condition to be met
-  [expectCatch](#expectcatcherr)(*err*) - expect an error to be caught
-  **Prominator**.[lift](#prominatorliftfn-instance)(*fn*, *[instance]*) - convert a node-style function to a promise

#### catchIf(predicate, fn)
Catches an error and invokes *fn* if *predicate* returns a truthy value. If a
falsy value is returned, the error will be re-thrown and the *fn* is not
invoked.

``` javascript
const Prominator = require('prominator');

function instanceOf(Type) {
  return function (o) {
    return o instanceof Type;
  };
}

Prominator.resolve(new SyntaxError())
  .catchIf(instanceOf(TypeError), console.log)
  .catch(console.log); // => SyntaxError

Prominator.resolve(new SyntaxError())
  .catchIf(instanceOf(SyntaxError), console.log) // => SyntaxError
  .catch(console.log);
```

#### expect(...modifiers, predicate)
Expects that a condition is met. The resolved value of the promise is modified
using the *modifiers* and then passed to a *predicate*. If the predicate returns
a truthy value, then the resolved value of the promise is returned. If the
predicate returns a falsy value, then the promise is rejected.

``` javascript
const Prominator = require('prominator');

function odd(n) {
  return (n & 1);
}

function plus(n) {
  return function (m) {
    return m + n;
  };
}

Prominator.resolve(3)
  .expect(odd)
  .then(console.log); // => 3

Prominator.resolve(4)
  .expect(odd)
  .catch(console.log); // => AssertionError

Prominator.resolve(6)
  .expect(plus(1), odd)
  .then(console.log); // => 6

Prominator.resolve(7)
  .expect(plus(1), odd)
  .catch(console.log); // => AssertionError
```

#### expectCatch(err)
Returns a new promise that resolves if *err* is caught. If no errors are caught
or the error is not equal to *err*, then the promise is rejected.

``` javascript
const Prominator = require('prominator');

Prominator.resolve('foo')
  .expectCatch('error')
  .catch(console.log); // => ExpectedPromiseRejectionError

Prominator.reject('foo')
  .expectCatch('error')
  .catch(console.log); // => AssertionError

Prominator.reject('error')
  .expectCatch('error')
  .then(console.log); // => undefined
```

#### Prominator.lift(fn, [instance])
Converts the node-style function *fn* to a promise. If an *instance* is
provided, it will be bound as the *this* parameter for the function.

``` javascript
const Prominator = require('prominator');

function add(n, callback) {
  callback(null, this + n);
}

const add3 = Prominator.lift(add, 3);
add3(4).then(console.log); // => 7
```
