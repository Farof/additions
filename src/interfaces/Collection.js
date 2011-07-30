(function (exports) {
  "use strict";

  var Collection = exports.Collection = function (Type, interfaces) {
    var collection = [], key;

    if (typeof interfaces === 'object') {
      for (key in interfaces) {
        Type.implements(new exports[key](interfaces[key]));
      }
    }

    return {
      items: {
        enumerable: true,
        get: function () {
          return collection;
        }
      },

      create: {
        enumerable: true,
        value: function (options) {
          var item = new Type(options);
          collection.push(item);
          return this;
        }
      }
    };
  };

}(window));
