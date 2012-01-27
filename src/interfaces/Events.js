(function (exports) {
  "use strict";

  var Events = exports.Events = function () {
    var events = {};

    return {
      addListener: {
        enumerable: true,
        value: function (name, func, once) {
          var self = this, wrapper;

          if (!events[name]) {
            events[name] = [];
          }

          if (typeof func === 'function') {
            if (once) {
              wrapper = function () {
                this.removeListener(name, wrapper);
                return func.apply(this, arguments);
              }.bind(this)
              events[name].include(wrapper);
            } else {
              events[name].include(func);
            }
          }

          return this;
        }
      },

      fireEvent: {
        enumerable: true,
        value: function (name, args) {
          var list = events[name], i, ln;

          if (list) {
            list = list.clone();
            args = Array.from(arguments).slice(1);
            for (i = 0, ln = list.length; i < ln; i += 1) {
              list[i].apply(this, args);
            }
          }

          return this;
        }
      },

      removeListener: {
        enumerable: true,
        value: function (name, func) {
          var list = events[name];

          if (Array.isArray(list)) {
            if (typeof func === 'function') {
              list.remove(func);
            } else {
              events[name] = [];
            }
          }
          return this;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));
