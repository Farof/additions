(function (exports) {
  "use strict";

  runner.suite('Events', function (assert) {
    runner.suite('Events implementation', function (assert) {
      var ev, obj = {};

      assert.type(Events, 'function');

      assert.type(new Events(), 'object');

      Object.extend(obj, new Events());
      assert.type(obj.addListener, 'function');
      assert.type(obj.fireEvent, 'function');
      assert.type(obj.removeListener, 'function');
    });

    runner.suite('Events scenario', function (assert) {
      var obj = {}, calls = 0, f = function () {
        calls += 1;
        assert.same(Array.from(arguments), [34, 46, 98]);
      };

      Object.extend(obj, new Events());

      obj.addListener('glop', f);

      obj.addListener('glop', function () {
        calls += 1;
        assert.same(Array.from(arguments), [34, 46, 98]);
      });

      obj.addListener('glop', function () {
        calls += 1;
        assert.same(Array.from(arguments), [34, 46, 98]);
      }, true);

      obj.addListener('prouf', function () {
        calls += 1;
        assert.same(Array.from(arguments), [42]);
      }, true);

      obj.addListener('prouf', function () {
        calls += 1;
        assert.same(Array.from(arguments), [42]);
      });

      obj.fireEvent('glop', 34, 46, 98);  // +3
      obj.fireEvent('glop', 34, 46, 98);  // +2
      obj.fireEvent('prouf', 42);         // +2
      obj.fireEvent('prouf', 42);         // +1

      obj.removeListener('glop', f);
      obj.fireEvent('glop', 34, 46, 98);  // +1
      obj.fireEvent('prouf', 42);

      obj.removeListener('glop');
      obj.fireEvent('glop', 34, 46, 98);  // +0
      obj.fireEvent('prouf', 42);         // +1

      assert.equal(calls, 11);
    });
  });

}(typeof exports === 'undefined' ? window : exports));
