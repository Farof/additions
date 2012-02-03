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

      assert.same(Object.properties(new Color({
        red: 34,
        green: 97,
        blue: 23,
        alpha: 121
      })), { red: 34, green: 97, blue: 23, alpha: 121 });
      //assert.same(Object.properties(Color.fromRGB()))
    });


    runner.suite('Color.toHexPart', function (assert) {
      assert.type(Color.toHexPart, 'function');

      assert.equal(Color.toHexPart(), '00');
      assert.equal(Color.toHexPart(255), 'FF');
      assert.equal(Color.toHexPart(1), '01');
      assert.equal(Color.toHexPart(256), '00');
      assert.equal(Color.toHexPart(128), '80');
      assert.equal(Color.toHexPart(511), 'FF');
      assert.equal(Color.toHexPart(512), '00');
    });

    runner.suite('Color.cutHex', function (assert) {
      assert.type(Color.cutHex, 'function');

      assert.equal(Color.cutHex('3E3D40'), '3E3D40');
      assert.equal(Color.cutHex('#543467'), '543467');
      assert.equal(Color.cutHex('893E4A12'), '893E4A');
      assert.equal(Color.cutHex('#3A45901D'), '3A4590');
    });

    runner.suite('Color.isRGBA', function (assert) {
      assert.type(Color.isRGBA, 'function');

      assert.isFalse(Color.isRGBA());
      assert.isFalse(Color.isRGBA(34));
      assert.isFalse(Color.isRGBA(''));
      assert.isFalse(Color.isRGBA('rgba()'));
      assert.isFalse(Color.isRGBA('rgba(23)'));
      assert.isFalse(Color.isRGBA('rgba(23, 45, 34, 54)'));
      assert.isFalse(Color.isRGBA('rgba(83, 78, 10, 0, 34)'));
      assert.isFalse(Color.isRGBA('rgba(0, 3, 4, 0);;'));
      assert.isFalse(Color.isRGBA('rgba(-4, 4, 5)'));
      assert.isFalse(Color.isRGBA('rgba(34, 256, 90)'));

      assert.isTrue(Color.isRGBA('rgba(34, 45, 12)'));
      assert.isTrue(Color.isRGBA('rgba(12, 45, 255, 0)'));
      assert.isTrue(Color.isRGBA('rgba(12, 45, 255, 1)'));
      assert.isTrue(Color.isRGBA('rgba(12, 45, 255, 0.8478)'));
      assert.isTrue(Color.isRGBA('rgba(12, 45, 255, 0);'));
      assert.isTrue(Color.isRGBA('rgba(12, 45, 255);'));
    });

    runner.suite('Color.isHex', function (assert) {
      assert.type(Color.isHex, 'function');

      assert.isFalse(Color.isHex());
      assert.isFalse(Color.isHex(12));
      assert.isFalse(Color.isHex(''));
      assert.isFalse(Color.isHex());
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
