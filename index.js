/**
 * Copyright (c) 2016 Chris Baker <mail.chris.baker@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

const assert = require('assert');

class ExpectedPromiseRejectionError extends Error {
  constructor(value) {
    super();

    this.name = 'ExpectedPromiseRejectionError';
    this.message = `Expected the promise to reject, but it resolved with ${value}`;
    this.value = value;
  }
}

function callback(resolve, reject) {
  return function (error, value) {
    return error ? reject(error) : resolve(value);
  };
}

function compose(f, g) {
  return function (x) {
    return g(f(x));
  };
}

function identity(x) {
  return x;
}

module.exports = class Prominator extends Promise {
  static lift(fn, instance) {
    return function () {
      const args = [].slice.call(arguments);

      return new Prominator(function (resolve, reject) {
        return fn.apply(instance, args.concat(callback(resolve, reject)));
      });
    };
  }

  catchIf(predicate, fn) {
    return this.catch(function (err) {
      if (predicate(err)) {
        return fn(err);
      }

      throw err;
    });
  }

  expect() {
    const predicate = [].slice.call(arguments).reduce(compose, identity);

    return this.then(function (value) {
      assert(predicate(value));
      return value;
    });
  }

  expectCatch(expected) {
    function resolved(value) {
      throw new ExpectedPromiseRejectionError(value);
    }

    function rejected(actual) {
      assert.deepStrictEqual(actual, expected);
    }

    return this.then(resolved, rejected);
  }
};
