(function (exports) {
  "use strict";

  var Collection = exports.Collection = function (Type) {
    var collection = [];

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
