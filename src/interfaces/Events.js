(function (exports) {
  "use strict";

  var Events = exports.Events = function () {
    var events = {};

    return {
      on: {
        enumerable: true,
        value: function (event, func) {
          events[event] = events[event] || [];
          events[event].include(func);
          return this;
        }
      },

      fire: {
        enumerable: true,
        value: function (event, args) {
          var funcs = events[event] || [], i, ln;
          for (i = 0, ln = funcs.length; i < ln; i += 1) {
            try {
              funcs[i].apply(this, args || []);
            } catch (e) {
              console.log('error calling function mapped to event "' + event + '": ', e, funcs[i]);
            }
          }
          return this;
        }
      },

      removeListener: {
        enumerable: true,
        value: function (event, func) {
          if (func) {
            events[event].remove(func);
          } else {
            events[event] = [];
          }
          return this;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));
