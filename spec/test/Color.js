(function (exports) {
  "use strict";

  runner.suite('Color', function (assert) {
    runner.suite('Color construction', function (assert) {
      var c = new Color();

      assert.same(Object.keys(Object.properties(c)), ['red', 'green', 'blue', 'alpha']);
      assert.same(c.red, 0);
      assert.same(c.green, 0);
      assert.same(c.blue, 0);
      assert.same(c.alpha, 255);

      console.log('prop', Object.properties, Object.properties(new Color()));

      assert.same(Object.properties(new Color({
        red: 34,
        green: 97,
        blue: 23,
        alpha: 121
      })), { red: 34, green: 97, blue: 23, alpha: 121 });
      //assert.same(Object.properties(Color.fromRGB()))
    });


    runner.suite('Color.toHexPart', function (assert) {

    });

    runner.suite('Color.cutHex', function (assert) {

    });

    runner.suite('Color.isRGBA', function (assert) {

    });

    runner.suite('Color.isHex', function (assert) {

    });

    runner.suite('Color.isHSV', function (assert) {

    });

    runner.suite('Color.fromRGBA', function (assert) {

    });

    runner.suite('Color.fromHex', function (assert) {

    });

    runner.suite('Color.fromHSV', function (assert) {

    });

    runner.suite('Color.channel', function (assert) {

    });

    runner.suite('Color.prototype', function (assert) {
      runner.suite('Color.prototype Events implementation', function (assert) {

      });

      runner.suite('Color.prototype.red', function (assert) {

      });

      runner.suite('Color.prototype.green', function (assert) {

      });

      runner.suite('Color.prototype.blue', function (assert) {

      });

      runner.suite('Color.prototype.alpha', function (assert) {

      });

      runner.suite('Color.prototype.serialize', function (assert) {

      });

      runner.suite('Color.prototype.set', function (assert) {

      });

      runner.suite('Color.prototype.scramble', function (assert) {

      });

      runner.suite('Color.prototype.reverse', function (assert) {

      });

      runner.suite('Color.prototype.toRGBA', function (assert) {

      });

      runner.suite('Color.prototype.toHex', function (assert) {

      });

      runner.suite('Color.prototype.toHSV', function (assert) {

      });

      runner.suite('Color.prototype.fromRGBA', function (assert) {

      });

      runner.suite('Color.prototype.fromHex', function (assert) {

      });

      runner.suite('Color.prototype.fromHSV', function (assert) {

      });

      runner.suite('Color.prototype.clone', function (assert) {

      });

      runner.suite('Color.prototype.toString', function (assert) {

      });
    });
  });

}(typeof exports === 'undefined' ? window : exports));
