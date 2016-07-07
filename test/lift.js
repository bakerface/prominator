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

class Divider {
  constructor(n) {
    this.n = n;
  }

  divide(n, done) {
    if (n === 0) {
      return done('divide-by-zero');
    }

    return done(null, this.n / n);
  }
}

describe('lift(fn, instance)', function () {
  beforeEach(function () {
    this.divider = new Divider(15);
    this.divide = Prominator.lift(this.divider.divide, this.divider);
  });

  it('should resolve the values', function (done) {
    this.divide(5)
      .then(function (n) {
        assert.equal(n, 3);
        done();
      });
  });

  it('should reject the errors', function (done) {
    this.divide(0)
      .catch(function (err) {
        assert.equal(err, 'divide-by-zero');
        done();
      });
  });
});
