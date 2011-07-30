(function (exports) {
  "use strict";

  var Map = exports.Map = function (Type, id) {
    var map = {};
    id = id || 'uuid';

    return {
      map: {
        enumerable: true,
        get: function () {
          return map;
        }
      },

      add: {
        enumerable: true,
        value: function (options) {
          var item = new Type(options);
          if (!item[id]) {
            item[id] = uuid();
          }
          map[item[id]] = item;
          return this;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));
