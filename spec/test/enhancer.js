(function (exports) {
  "use strict";

  runner.suite('enhancer', function (assert) {

    runner.suite('Object', function (assert) {

      runner.suite('Object.defineProperty', function (assert) {
        var obj = {};
        assert.type(Object.defineProperty, 'function');
        assert.isUndefined(obj.myProp);
        Object.defineProperty(obj, 'myProp', {
          value: function () {
            return 42;
          }
        });
        assert.type(obj.myProp, 'function');
        assert.equal(obj.myProp(), 42);
      });

      runner.suite('Object.keys', function (assert) {
        var obj = { a: 4, F: 5, plop: 'yeah' };
        assert.type(Object.keys, 'function');
        assert.same(Object.keys(obj), ['a', 'F', 'plop']);
      });

      runner.suite('Object.undefined', function (assert) {
        assert.isUndefined(Object.undefined);
      });

      runner.suite('Object.isDefined', function (assert) {
        var obj = { a: 4, b: null, c: (function () {}()) };

        assert.isTrue(Object.isDefined(obj.a));
        assert.isFalse(Object.isDefined(obj.b));
        assert.isFalse(Object.isDefined(obj.c));
      });

      runner.suite('Object.isUndefined', function (assert) {
        var obj = { a: 4, b: null, c: (function () {}()) };

        assert.isFalse(Object.isUndefined(obj.a));
        assert.isTrue(Object.isUndefined(obj.b));
        assert.isTrue(Object.isUndefined(obj.c));
      });

      /***
        * undefined
        * null
        * number / 0
        * string / ''
        * function
        * object
        * array
        **/
      runner.suite('Object.same', function (assert) {
        assert.type(Object.same, 'function');

        runner.suite('undefined', function (assert) {
          assert.isTrue(Object.same(Object.undefined, Object.undefined));
          assert.isFalse(Object.same(Object.undefined, null));
          assert.isFalse(Object.same(Object.undefined, 6));
          assert.isFalse(Object.same(Object.undefined, 0));
          assert.isFalse(Object.same(Object.undefined, 'plop'));
          assert.isFalse(Object.same(Object.undefined, ''));
          assert.isFalse(Object.same(Object.undefined, function () {}));
          assert.isFalse(Object.same(Object.undefined, {}));
          assert.isFalse(Object.same(Object.undefined, { a: 4 }));
          assert.isFalse(Object.same(Object.undefined, []));
          assert.isFalse(Object.same(Object.undefined, [4, 2]));
        });

        runner.suite('null', function (assert) {
          assert.isTrue(Object.same(null, null));
          assert.isFalse(Object.same(null, 6));
          assert.isFalse(Object.same(null, 0));
          assert.isFalse(Object.same(null, 'plop'));
          assert.isFalse(Object.same(null, ''));
          assert.isFalse(Object.same(null, function () {}));
          assert.isFalse(Object.same(null, {}));
          assert.isFalse(Object.same(null, { a: 4 }));
          assert.isFalse(Object.same(null, []));
          assert.isFalse(Object.same(null, [4, 2]));
        });

        runner.suite('number', function (assert) {
          assert.isTrue(Object.same(6, 6));
          assert.isFalse(Object.same(6, 3));
          assert.isFalse(Object.same(6, 0));
          assert.isFalse(Object.same(6, 'plop'));
          assert.isFalse(Object.same(6, ''));
          assert.isFalse(Object.same(6, '6'));
          assert.isFalse(Object.same(6, function () {}));
          assert.isFalse(Object.same(6, {}));
          assert.isFalse(Object.same(6, { a: 6 }));
          assert.isFalse(Object.same(6, []));
          assert.isFalse(Object.same(6, [4, 2]));
        });

        runner.suite('0', function (assert) {
          assert.isTrue(Object.same(0, 0));
          assert.isFalse(Object.same(0, 3));
          assert.isFalse(Object.same(0, 'plop'));
          assert.isFalse(Object.same(0, ''));
          assert.isFalse(Object.same(0, '0'));
          assert.isFalse(Object.same(0, function () {}));
          assert.isFalse(Object.same(0, {}));
          assert.isFalse(Object.same(0, { a: 0 }));
          assert.isFalse(Object.same(0, []));
          assert.isFalse(Object.same(0, [4, 2]));
        });

        runner.suite('string', function (assert) {
          assert.isTrue(Object.same('glop', 'glop'));
          assert.isFalse(Object.same('glop', 'plop'));
          assert.isFalse(Object.same('glop', ''));
          assert.isFalse(Object.same('glop', function () {}));
          assert.isFalse(Object.same('glop', {}));
          assert.isFalse(Object.same('glop', { a: 'glop' }));
          assert.isFalse(Object.same('glop', []));
          assert.isFalse(Object.same('glop', ['glop']));
          assert.isFalse(Object.same('glop', ['g', 'l', 'o', 'p']));
        });

        runner.suite('\'\'', function (assert) {
          assert.isTrue(Object.same('', ''));
          assert.isFalse(Object.same('', 'plop'));
          assert.isFalse(Object.same('', function () {}));
          assert.isFalse(Object.same('', {}));
          assert.isFalse(Object.same('', { a: ''}));
          assert.isFalse(Object.same('', []));
          assert.isFalse(Object.same('', ['']));
        });

        runner.suite('function', function (assert) {
          var fn = function () {};
          assert.isTrue(Object.same(fn, fn));
          assert.isFalse(Object.same(fn, function () {}));
          assert.isFalse(Object.same(fn, {}));
          assert.isFalse(Object.same(fn, { a: fn }));
          assert.isFalse(Object.same(fn, []));
          assert.isFalse(Object.same(fn, [fn]));
        });

        runner.suite('{}', function (assert) {
          assert.isTrue(Object.same({}, {}));
          assert.isFalse(Object.same({}, { a: 4 }));
          assert.isFalse(Object.same({}, []));
          assert.isFalse(Object.same({}, [4, 2]));
        });

        runner.suite('{...}', function (assert) {
          assert.isTrue(Object.same({ a: 4, b: 2}, { a: 4, b: 2 }));
          assert.isTrue(Object.same({ a: 4, b: 2}, { b: 2, a: 4 }));
          assert.isFalse(Object.same({ a: 4, b: 2}, { a: 4 }));
          assert.isFalse(Object.same({ a: 4, b: 2}, { a: 4, b: 2, c: 7 }));
          assert.isFalse(Object.same({ a: 4, b: 2}, { a: 4, b: 3 }));
          assert.isFalse(Object.same({ a: 4, b: 2}, []));
          assert.isFalse(Object.same({ a: 4, b: 2}, [4, 2]));
        });

        runner.suite('[]', function (assert) {
          assert.isTrue(Object.same([], []));
          assert.isFalse(Object.same([], [4, 2]));
        });

        runner.suite('[...]', function (assert) {
          assert.isTrue(Object.same([4, 2], [4, 2]));
          assert.isFalse(Object.same([4, 2], [4, 2, 5]));
          assert.isFalse(Object.same([4, 2], [5, 4, 2]));
          assert.isFalse(Object.same([4, 2], [4]));
          assert.isFalse(Object.same([4, 2], [2]));
          assert.isFalse(Object.same([4, 2], [2, 4]));
        });
      });

      runner.suite('Object.forEach', function (assert) {
        var obj = { a: 1, b: 2, c: 3, d: 5}, mark = 3, lastKey, objRef;

        assert.type(Object.forEach, 'function');
        Object.forEach(obj, function (value, key, objCopy) {
          mark += value,
          lastKey = key;
          objRef = objCopy;
        });
        assert.equal(mark, 14);
        assert.equal(lastKey, 'd');
      });

      runner.suite('Object.map', function (assert) {
        var obj = { a: 2, b: 6, c: 3, d: 5 }, mapped, lastKey, ref;

        assert.type(Object.map, 'function');
        mapped = Object.map(obj, function (value, key, objCopy) {
          ref = objCopy;
          lastKey = key;
          return value * 2;
        });
        assert.equal(obj, ref);
        assert.equal(lastKey, 'd');
        assert.same(mapped, { a: 4, b: 12, c: 6, d: 10 });
      });

      runner.suite('Object.some', function (assert) {
        var obj = { a: 3, b: '5' }, has, ref, firstGood;

        assert.type(Object.some, 'function');
        has = Object.some(obj, function (value, key, copy) {
          ref = copy;
          firstGood = key;
          return typeof value === 'string';
        });
        assert.isTrue(has);
        assert.equal(ref, obj);
        assert.equal(firstGood, 'b');
        assert.isFalse(Object.some(obj, function (value) {
          return value === 42;
        }));
      });

      runner.suite('Object.every', function (assert) {
        var obj = { a: 4, b: 13 }, ref, lastKey;

        assert.type(Object.every, 'function');

        assert.isTrue(Object.every(obj, function (value, key, copy) {
          ref = copy;
          lastKey = key;
          return typeof value === 'number';
        }));
        assert.equal(obj, ref);
        assert.equal(lastKey, 'b');

        assert.isFalse(Object.every(obj, function (value) {
          return value < 10;
        }));
      });

      runner.suite('Object.match', function (assert) {
        var obj = { a: 42, b: 'glop', c: 42, e: 'yeah', d: function () {} }, ref, matchValue;

        assert.type(Object.match, 'function');

        assert.equal(Object.match(obj, function (value, key, copy) {
          ref = copy;
          matchValue = value;
          return typeof value === 'string';
        }), 'b');
        assert.equal(ref, obj);
        assert.equal(matchValue, 'glop');

        assert.isUndefined(Object.match(obj, function (value) {
          return !value;
        }));
      });

      runner.suite('Object.lastMatch', function (assert) {
        var f = function () {}, obj = { a: 42, b: 'glop', c: 42, e: 'yeah', d: f }, ref, lastValue;

        assert.type(Object.lastMatch, 'function');

        assert.equal(Object.lastMatch(obj, function (value, key, copy) {
          ref = copy;
          lastValue = value;
          return typeof value === 'string';
        }), 'e');
        assert.equal(ref, obj);
        assert.equal(lastValue, f);

        assert.isUndefined(Object.lastMatch(obj, function (value) {
          return !value;
        }));
      });

      runner.suite('Object.keyOf', function (assert) {
        var obj = { a: 3, g: 6, d: 7, t: 6 };

        assert.type(Object.keyOf, 'function');

        assert.equal(Object.keyOf(obj, 6), 'g');
        assert.isUndefined(Object.keyOf(obj, 9));
      });

      runner.suite('Object.lastKeyOf', function (assert) {
        var obj = { a: 3, g: 6, d: 7, t: 6 };

        assert.type(Object.lastKeyOf, 'function');

        assert.equal(Object.lastKeyOf(obj, 6), 't');
        assert.isUndefined(Object.lastKeyOf(obj, 9));
      });

      runner.suite('Object.values', function (assert) {
        var f = function () {
          return 42;
        };
        assert.type(Object.values, 'function');
        assert.same(Object.values({ f: f, r: 4, g: 'glop' }), [f, 4, 'glop']);
      });

      runner.suite('Object.merge', function (assert) {
        assert.type(Object.merge, 'function');
        assert.same(Object.merge({ a: 1, b: 2, c: 3 }, { b: 'glop', d: 5 }), { a: 1, b: 'glop', c: 3, d: 5 });
      });

      runner.suite('Object.implements', function (assert) {
        var f = function () { return 42; }, obj = { a: 4, g: 3, f: 'glop', t: f };
        assert.type(Object.implements, 'function');

        assert.isTrue(Object.implements(obj, { g: 3, t: f }));
        assert.isFalse(Object.implements(obj, { g: 3, t: f, y: 4 }));
        assert.isFalse(Object.implements(obj, { g: 5, t: f }));
        assert.isFalse(Object.implements(obj, { g: 3, t: function () { return 41; } }));
      });

      runner.suite('Object.extend', function (assert) {
        var obj = {}, f = function () {}, add = {
          e: {
            value: 'glop'
          },
          f: {
            value: f
          }
        };
        
        assert.type(Object.extend, 'function');
        
        assert.isUndefined(obj.e);
        assert.isUndefined(obj.f);
        
        Object.extend(obj, add);
        
        assert.equal(obj.e, 'glop');
        assert.equal(obj.f, f);
      });

      runner.suite('Object.describe', function (assert) {
        assert.equal(Object.describe(Object.undefined), 'undefined');
        assert.equal(Object.describe(null), 'null');
        assert.equal(Object.describe(1), '1');
        assert.equal(Object.describe('42'), '42');
        assert.equal(Object.describe(function () { return 42; }), (function () { return 42; }).toString());
        assert.equal(Object.describe([4, 2]), '[\n\t4,\n\t2\n]');
        assert.equal(Object.describe({ x: 3, y: 5 }), '{\n\tx: 3,\n\ty: 5\n}');

        assert.equal(Object.describe([4, { d: 4, c: 2 }, 5]), '[\n\t4,\n\t{\n\t\td: 4,\n\t\tc: 2\n\t},\n\t5\n]');
        assert.equal(Object.describe({ e: 3, b: [4, 2], f: 5 }), '{\n\te: 3,\n\tb: [\n\t\t4,\n\t\t2\n\t],\n\tf: 5\n}');
      });

      runner.suite('Object.properties', function (assert) {
        assert.type(Object.properties, 'function');

        assert.same(Object.properties({}), {});
        assert.same(Object.properties({ x: 3, f: 4 }), { x: 3, f: 4 });
        assert.same(Object.properties({ x: 3, f: 4, g: function () {} }), { x: 3, f: 4 });
      })
    });

    runner.suite('Function', function (assert) {
      runner.suite('Function.prototype', function (assert) {
        runner.suite('Function.prototype.extends', function (assert) {
          var base = function () {}, I = {
            a: {
              value: 1
            },
            b: {
              value: 2
            },
            c: {
              get: function () {
                return 42;
              }
            }
          };

          assert.type(base.extends, 'function');

          assert.isUndefined(base.a);
          assert.isUndefined(base.b);
          assert.isUndefined(base.c);

          base.extends(I);

          assert.equal(base.a, 1);
          assert.equal(base.b, 2);
          assert.equal(base.c, 42);
        });

        runner.suite('Function.prototype.implements', function (assert) {
          var base = function () {}, I = {
            a: {
              value: 1
            },
            b: {
              value: 2
            },
            c: {
              get: function () {
                return 42;
              }
            }
          };

          assert.type(base.implements, 'function');

          assert.isUndefined(new base().a);
          assert.isUndefined(new base().b);
          assert.isUndefined(new base().c);

          base.implements(I);

          assert.equal(new base().a, 1);
          assert.equal(new base().b, 2);
          assert.equal(new base().c, 42);
        });

        runner.suite('Function.prototype.delay', function (assert) {
          var mark = {};

          (function () {
            mark.a = 3;
          }).delay();

          (function () {
            mark.b = 7;
          }).delay(200);

          (function () {
            mark.c = this;
          }).delay(300, 42);

          (function () {
            mark.d = this;
          }).delay(400);

          return function (assert) {
            assert.equal(mark.a, 3);
            assert.equal(mark.b, 7);
            assert.equal(mark.c, 42);
            assert.isUndefined(mark.d);
          };
        }, 500);

        runner.suite('Function.prototype.unshift', function (assert) {
          var i = 0, u = 0, f = function () {
            i += 1;
            assert.equal(arguments.length, u + 1);

            if (arguments.length === 1) {
              assert.equal(arguments[0], 45);
            } else if (arguments.length === 2) {
              assert.equal(arguments[0], 35);
              assert.equal(arguments[1], 98);
            } else if (arguments.length === 3) {
              assert.equal(arguments[0], 35);
              assert.equal(arguments[1], 76);
              assert.equal(arguments[2], 37);
            }

            return 42;
          }, unshifted;

          assert.type(f.unshift, 'function');

          assert.equal(f(45), 42);

          unshifted = f.unshift(35);
          assert.equal(f(45), 42);
          u += 1;
          assert.equal(unshifted(98), 42);

          unshifted = unshifted.unshift(76);
          u += 1;
          assert.equal(unshifted(37), 42);
        });
      });
    });

    runner.suite('Event', function (assert) {
      runner.suite('Event.prototype', function (assert) {
        runner.suite('Event.prototype.stop', function (assert) {
          var
            mark = {
              capture: false,
              bubble: false,
              target: false
            },
            bubble = function () {
              mark.bubble = true;
              document.body.removeEventListener('click', bubble, false);
            },
            capture = function (e) {
              e.stop();
              mark.capture = true;
              document.body.removeEventListener('click', capture, true);
            },
            target = function (e) {
              mark.target = true;
              document.body.removeEventListener('click', target, false);
            };

          document.body.addEventListener('click', bubble, false);
          document.body.addEventListener('click', capture, true);
          document.$('#tests').addEventListener('click', target, false);

          assert.equal(mark.capture, false);
          assert.equal(mark.bubble, false);
          assert.equal(mark.target, false);

          document.$('#tests').click();

          assert.equal(mark.capture, true);
          assert.equal(mark.bubble, false);
          assert.equal(mark.target, false);
        });
      });
    });

    runner.suite('Array', function (assert) {
      runner.suite('Array.from', function (assert) {
        assert.type(Array.from, 'function');

        assert.same(Array.from(), []);
        assert.same(Array.from([3, 4, 5]), [3, 4, 5]);
        assert.same(Array.from({ a: 1, b: 2, c: 3}), [{ a: 1, b: 2, c: 3}]);
        assert.same(Array.from(34), [34]);
        assert.same(Array.from('glop'), ['glop']);
        (function () { assert.same(Array.from(arguments), [42]); }(42));
      });

      runner.suite('Array.prototype', function (assert) {
        runner.suite('Array.prototype.clone', function (assert) {
          var ar = [34, 32, 67, 98], clone;

          assert.type(ar.clone, 'function');

          clone = ar.clone();

          assert.same(ar, clone);
          assert.isFalse(ar === clone);
        });

        runner.suite('Array.prototype.first', function (assert) {
          assert.isUndefined([].first);
          assert.equal(['', 3, 4, '132'].first, '');
          assert.equal([0, 45, 'aze'].first, 0);
          assert.equal([42, 67].first, 42);
        });

        runner.suite('Array.prototype.last', function (assert) {
          assert.isUndefined([].last);
          assert.equal(['132', 3, 4, ''].last, '');
          assert.equal(['aze', 45, 0].last, 0);
          assert.equal([42, 67].last, 67);
        });

        runner.suite('Array.prototype.contains', function (assert) {
          assert.type([].contains, 'function');

          assert.isFalse([].contains(Object.undefined));
          assert.isTrue([Object.undefined].contains(Object.undefined));
          assert.isTrue([3, 5, 'aez', '', 9].contains(''));
          assert.isTrue([3, 5, 'aez', 0, 9].contains(0));
          assert.isFalse([3, 5, 'aez', '', 9].contains(42));
        });

        runner.suite('Array.prototype.match', function (assert) {
          var
            obj = { magic: 42 },
            obj2 = { magic: 24 },
            obj3 = { magic: 42 },
            f = function (item) {
              return typeof item === 'object' && item.magic === 42;
            };

          assert.type([].match, 'function');

          assert.equal([3, 4, 5].match(f), Object.undefined);
          assert.equal([3, obj, 4, obj2, 6, obj3, 5].match(f), obj);
        });

        runner.suite('Array.prototype.lastMatch', function (assert) {
          var
            obj = { magic: 42 },
            obj2 = { magic: 24 },
            obj3 = { magic: 42 },
            f = function (item) {
              return typeof item === 'object' && item.magic === 42;
            };

          assert.type([].lastMatch, 'function');

          assert.equal([3, 4, 5].lastMatch(f), Object.undefined);
          assert.equal([3, obj, 4, obj2, 6, obj3, 5].lastMatch(f), obj3);
        });

        runner.suite('Array.prototype.include', function (assert) {
          var ar = [4, 3, 5];

          assert.type([].include, 'function');

          assert.equal(ar.length, 3);
          assert.isFalse(ar.contains(42));
          assert.equal(ar.last, 5);

          assert.equal(ar.include(42), ar);

          assert.equal(ar.length, 4);
          assert.isTrue(ar.contains(42));
          assert.equal(ar.last, 42);

          ar.include(24);
          assert.equal(ar.length, 5);
          assert.isTrue(ar.contains(24));
          assert.equal(ar.last, 24);

          ar.include(42);
          assert.equal(ar.length, 5);
          assert.isTrue(ar.contains(42));
          assert.equal(ar.last, 24);
        });

        runner.suite('Array.prototype.merge', function (assert) {
          var ar = [];

          assert.type([].merge, 'function');

          assert.same(ar.merge(), []);
          assert.same(ar.merge(7), []);
          assert.same(ar.merge([]), []);
          assert.same(ar.merge([1, 5, 3]), [1, 5, 3]);
          assert.same(ar.merge([42, 5, 13]), [1, 5, 3, 42, 13]);
        });

        runner.suite('Array.prototype.remove', function (assert) {
          var f = function () {}, ar = [23, 54, 67, f, 'aze', 0];

          assert.type(ar.remove, 'function');

          assert.equal(ar.remove(), ar)
          assert.same(ar, [23, 54, 67, f, 'aze', 0]);

          ar.remove(54)
          assert.same(ar, [23, 67, f, 'aze', 0]);

          ar.remove(f);
          assert.same(ar, [23, 67, 'aze', 0]);
        });

        runner.suite('Array.prototype.every', function (assert) {
          var f = function (item) {
            return typeof item === 'number';
          }

          assert.type([].every, 'function');

          assert.isTrue([].every(f));
          assert.isFalse(['RE', null].every(f));
          assert.isFalse([43, 'RE', 34, null].every(f));
          assert.isTrue([3, 5, 2, 42].every(f));
        });

        runner.suite('Array.prototype.some', function (assert) {
          var f = function (item) {
            return typeof item === 'number';
          }

          assert.type([].some, 'function');

          assert.isTrue([].some(f));
          assert.isFalse(['RE', null].some(f));
          assert.isTrue([43, 'RE', 34, null].some(f));
          assert.isTrue([3, 5, 2, 42].some(f));
        });
      });
    });

    runner.suite('Number', function (assert) {
      runner.suite('Number.prototype', function (assert) {
        runner.suite('Number.prototype.bounds', function (assert) {
          assert.type((4).bounds, 'function');

          assert.equal((4).bounds(), 4);
          assert.equal((4).bounds(0), 4);
          assert.equal((4).bounds(10), 4);
          assert.equal((4).bounds(1), 1);
          assert.equal((4).bounds(0, 3), 3);
          assert.equal((4).bounds(-6), 0);

          assert.equal((-4).bounds(), 0);
          assert.equal((-4).bounds(0), 0);
          assert.equal((-4).bounds(10), 0);
          assert.equal((-4).bounds(1), 0);
          assert.equal((-4).bounds(0, 3), 0);
          assert.equal((-4).bounds(-6), -4);
          assert.equal((-4).bounds(-2), -2);
        });
      });
    });

    runner.suite('HTMLDocument', function (assert) {
      runner.suite('HTMLDocument.prototype', function (assert) {
        runner.suite('HTMLDocument.prototype.$', function (assert) {
          assert.type(document.$, 'function');

          assert.error(function () { document.$(); });
          assert.error(function () { document.$(''); });
          assert.equal(document.$('aze'), null);
          assert.equal(document.$('#tests'), document.querySelector('#tests'));
        });

        runner.suite('HTMLDocument.prototype.$$', function (assert) {
          assert.type(document.$$, 'function');

          assert.error(function () { document.$$(); });
          assert.error(function () { document.$$(''); });
          assert.same(document.$$('aze'), {});
          assert.same(document.$$('.testsuite'), document.querySelectorAll('.testsuite'));
        });
      });
    });

    runner.suite('HTMLElement', function (assert) {
      runner.suite('HTMLElement.prototype', function (assert) {
        runner.suite('HTMLElement.prototype.$', function (assert) {

        });

        runner.suite('HTMLElement.prototype.$$', function (assert) {

        });

        runner.suite('HTMLElement.prototype.grab', function (assert) {

        });

        runner.suite('HTMLElement.prototype.adopt', function (assert) {

        });

        runner.suite('HTMLElement.prototype.unlaod', function (assert) {

        });

        runner.suite('HTMLElement.prototype.empty', function (assert) {

        });

        runner.suite('HTMLElement.prototype.replaces', function (assert) {

        });

        runner.suite('HTMLElement.prototype.getPosition', function (assert) {

        });

        runner.suite('HTMLElement.prototype.setDragAction', function (assert) {

        });
        
        runner.suite('HTMLElement.prototype.setAbsolute', function (assert) {

        });
      });
    });

    runner.suite('String', function (assert) {
      runner.suite('String.prototype', function (assert) {
        runner.suite('String.prototype.contains', function (assert) {
          assert.type('glop'.contains, 'function');

          assert.isTrue('yeahhehe'.contains(''));
          assert.isTrue('proufyeahglop'.contains('eahg'));
          assert.isFalse('glopgneh'.contains('grouf'));
        });

        runner.suite('String.prototype.repeat', function (assert) {
          assert.type('glop'.repeat, 'function');

          assert.equal('glop'.repeat(0), '');
          assert.equal('glop'.repeat(-1), '');
          assert.equal('glop'.repeat(1), 'glop');
          assert.equal('glop'.repeat(3), 'glopglopglop');
          assert.equal('glop'.repeat(3, '#'), 'glop#glop#glop');
        });
      });

      runner.suite('String.prototype.wrapTag', function (assert) {
        assert.type('glop'.wrapTag, 'function');
        assert.equal('glop'.wrapTag('div'), '<div>glop</div>');
        assert.equal('glop'.wrapTag('pre', 1), '<pre>\n\tglop\n</pre>');
      });
    });

    runner.suite('Math', function (assert) {
      runner.suite('Math.randomInt', function (assert) {
        
      });
    });
  });

}(typeof exports === 'undefined' ? window : exports));
