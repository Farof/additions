(function (exports) {
  "use strict";

  runner.suite('Color', function (assert) {
    runner.suite('Color construction', function (assert) {
      var c = new Color();

      assert.same(Object.keys(Object.properties(c)), ['red', 'green', 'blue', 'alpha']);
      assert.between(c.red, 0, 255);
      assert.between(c.green, 0, 255);
      assert.between(c.blue, 0, 255);
      assert.equal(c.alpha, 1);

      assert.same(Object.properties(new Color(34, 97, 23, 0.4)), { red: 34, green: 97, blue: 23, alpha: 0.4 });
      //assert.same(Object.properties(Color.fromRGB()))
    });

    runner.suite('Color.fromRGB', function (assert) {

    });

    runner.suite('Color.fromRGBA', function (assert) {

    });

    runner.suite('Color.fromHex', function (assert) {

    });

    runner.suite('Color.prototype', function (assert) {
      runner.suite('Color.prototype.toRGB', function (assert) {

      });

      runner.suite('Color.prototype.toRGBA', function (assert) {

      });

      runner.suite('Color.prototype.toHex', function (assert) {

      });
    });
  });

}(typeof exports === 'undefined' ? window : exports));
