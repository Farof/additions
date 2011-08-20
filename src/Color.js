(function (exports) {
  "use strict";

  var Color = exports.Color = function (r, g, b, a) {
    this.red = r || Math.randomInt(255);
    this.green = g || Math.randomInt(255);
    this.blue = b || Math.randomInt(255);
    this.alpha = typeof a === 'number' ? new Number.Range(1).limit(a) : 1;
  };

  Color.extends({
    fromRGB: {
      value: function (r, g, b) {
        return new Color(r, g, b);
      }
    },

    fromRGBA: {
      value: function (r, g, b, a) {
        return new Color(r, g, b, a);
      }
    },

    fromHex: {
      value: function (r, g, b) {
        var h;
        if (arguments.length === 1) {
          h = r.replace('#', '');
          r = h.substring(0, 2);
          g = h.substring(2, 4);
          b = h.substring(4, 6);
        }
        return new Color(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
      }
    }
  })

  Color.implements({
    toRGB: {
      enumerable: true,
      value: function () {
        return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue +')';
      }
    },

    toRGBA: {
      enumerable: true,
      value: function () {
        return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
      }
    },

    toHexPart: {
      value: function (n) {
        var str = '0123456789ABCDEF';

        n = parseInt(n, 10);
        if (isNaN(n)) {
          n = 0;
        }
        n = new Number.Range(255).limit(n);

        return str.charAt((n - n % 16) / 16) + str.charAt(n % 16);
      }
    },

    toHex: {
      enumerable: true,
      value: function (prefix) {
        return (prefix ? '#' : '') + this.toHexPart(this.red) + this.toHexPart(this.green) + this.toHexPart(this.blue);
      }
    }
  });

}(window));
