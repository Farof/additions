(function (exports) {
  "use strict";

  Number.Range = function (min, max) {
    max = typeof max === 'number' ? max : (min ? 0 : 100);
    min = min || 0;

    this.min = Math.min(min, max);
    this.max = Math.max(min, max);
  };

  Number.Range.implements({
    min: {
      enumerable: true,
      writable: true,
      value: 0
    },

    max: {
      enumerable: true,
      writable: true,
      value: 100
    },

    limit: {
      enumerable: true,
      value: function (value) {
        return Math.max(this.min, Math.min(value, this.max));
      }
    }
  });

}(typeof exports === 'undefined' ? window : exports));
