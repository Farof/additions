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
      })

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
        var obj = { a: 2, b: 6, c: 3, d: 5 };
      });
    });

  });

}(typeof exports === 'undefined' ? window : exports));
