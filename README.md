# prominator
[![npm package](https://badge.fury.io/js/prominator.svg)](http://badge.fury.io/js/prominator)
[![build](https://travis-ci.org/bakerface/prominator.svg?branch=master)](https://travis-ci.org/bakerface/prominator)
[![code climate](https://codeclimate.com/github/bakerface/prominator/badges/gpa.svg)](https://codeclimate.com/github/bakerface/prominator)
[![coverage](https://codeclimate.com/github/bakerface/prominator/badges/coverage.svg)](https://codeclimate.com/github/bakerface/prominator/coverage)
[![issues](https://img.shields.io/github/issues/bakerface/prominator.svg)](https://github.com/bakerface/prominator/issues)
[![dependencies](https://david-dm.org/bakerface/prominator.svg)](https://david-dm.org/bakerface/prominator)
[![devDependencies](https://david-dm.org/bakerface/prominator/dev-status.svg)](https://david-dm.org/bakerface/prominator#info=devDependencies)

### Table of Contents
-  **Prominator**.[lift](#prominatorliftfn-instance)(*fn*, *[instance]*) - convert a node-style function to a promise

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
