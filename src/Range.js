(function (exports) {
  "use strict";

  Number.Range = function (min, max) {
    max = max || (min ? 0 : 100);
    min = min || 0;

    this.min = Math.min(min, max);
    this.max = Math.max(min, max);
  };

  Number.Range.implements({
    limit: {
      value: function (value) {
        if (value > this.max) {
          return this.max;
        } else if (value < this.min) {
          return this.min;
        }
        return value;
      }
    }
  });

}(typeof exports === 'undefined' ? window : exports));
