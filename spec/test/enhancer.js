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

      });

      runner.suite('Object.match', function (assert) {

      });

      runner.suite('Object.lastMatch', function (assert) {

      });

      runner.suite('Object.indexOf', function (assert) {

      });

      runner.suite('Object.lastIndexOf', function (assert) {

      });

      runner.suite('Object.values', function (assert) {

      });

      runner.suite('Object.merge', function (assert) {

      });

      runner.suite('Object.implements', function (assert) {

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

        });

        runner.suite('Function.prototype.implements', function (assert) {

        });

        runner.suite('Function.prototype.delay', function (assert) {

        });

        runner.suite('Function.prototype.unshift', function (assert) {

        });
      });
    });

    runner.suite('Event', function (assert) {
      runner.suite('Event.prototype', function (assert) {
        runner.suite('Event.prototype.stop', function (assert) {

        });
      });
    });

    runner.suite('Array', function (assert) {
      runner.suite('Array.from', function (assert) {

      });

       runner.suite('Array.prototype', function (assert) {
          runner.suite('Array.prototype.first', function (assert) {

          });

          runner.suite('Array.prototype.last', function (assert) {

          });

          runner.suite('Array.prototype.contains', function (assert) {

          });

          runner.suite('Array.prototype.match', function (assert) {

          });

          runner.suite('Array.prototype.lastMatch', function (assert) {

          });

          runner.suite('Array.prototype.include', function (assert) {

          });

          runner.suite('Array.prototype.merge', function (assert) {

          });

          runner.suite('Array.prototype.remove', function (assert) {

          });
        });
    });

    runner.suite('Number', function (assert) {
      runner.suite('Number.prototype', function (assert) {
        runner.suite('Number.prototype.bounds', function (assert) {

        });
      });
    });

    runner.suite('HTMLDocument', function (assert) {
      runner.suite('HTMLDocument.prototype', function (assert) {
        runner.suite('HTMLDocument.prototype.$', function (assert) {

        });

        runner.suite('HTMLDocument.prototype.$$', function (assert) {

        });

        runner.suite('HTMLDocument.prototype.$$$', function (assert) {

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
      });
    });

    runner.suite('String', function (assert) {
      runner.suite('String.prototype', function (assert) {
        runner.suite('String.prototype.contains', function (assert) {
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
