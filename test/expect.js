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
const Prominator = require('..');

function typeOf(type) {
  return function (x) {
    return typeof x === type;
  };
}

function times(x) {
  return function (y) {
    return x * y;
  };
}

function plus(x) {
  return function (y) {
    return x + y;
  };
}

function equals(x) {
  return function (y) {
    return x === y;
  };
}

describe('expect(...modifiers, predicate)', function () {
  describe('when the predicate is undefined', function () {
    it('should resolve', function () {
      return Prominator.resolve('foo').expect();
    });
  });

  describe('when a predicate returns true', function () {
    it('should resolve', function () {
      return Prominator.resolve('foo')
        .expect(typeOf('string'));
    });
  });

  describe('when a predicate returns false', function () {
    it('should reject', function (done) {
      return Prominator.resolve('foo')
        .expect(typeOf('function'))
        .catch(function () {
          done();
        });
    });
  });

  describe('when the modifiers are defined', function () {
    it('should apply them sequentially', function () {
      return Prominator.resolve(3)
        .expect(times(2), plus(1), equals(7))
        .then(x => assert.equal(x, 3));
    });
  });
});
