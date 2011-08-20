(function (exports) {
  "use strict";

  runner.suite('Number.Range', function (assert) {
    runner.suite('Number.Range construction', function (assert) {
      assert.type(Number.Range, 'function');
      
      assert.same(Object.properties(new Number.Range()), { min: 0, max: 100 });
      assert.same(Object.properties(new Number.Range(0)), { min: 0, max: 100 });
      assert.same(Object.properties(new Number.Range(1)), { min: 0, max: 1 });
      assert.same(Object.properties(new Number.Range(45)), { min: 0, max: 45 });
      assert.same(Object.properties(new Number.Range(0, 0)), { min: 0, max: 0 });
      assert.same(Object.properties(new Number.Range(0, 1)), { min: 0, max: 1 });
      assert.same(Object.properties(new Number.Range(0, 45)), { min: 0, max: 45 });
      assert.same(Object.properties(new Number.Range(37, 234)), { min: 37, max: 234 });
      assert.same(Object.properties(new Number.Range(80, 24)), { min: 24, max: 80 });
    });
    
    runner.suite('Number.Range.prototype', function (assert) {
      runner.suite('Number.Range.prototype.limit', function (assert) {

      });
    });
  });

}(typeof exports === 'undefined' ? window : exports));
