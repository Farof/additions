(function (exports) {
  "use strict";

  var Map = exports.Map = function (Type, id, interfaces) {
    var map = {}, key;
    id = id || 'uuid';
    if (typeof id === 'object') {
      interfaces = id;
      id = 'uuid';
    }

    if (typeof interfaces === 'object') {
      for (key in interfaces) {
        Type.implements(new exports[key](interfaces[key]));
      }
    }

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
          return item;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));
