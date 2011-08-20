(function (exports) {
  "use strict";

  var Events = exports.Events = function () {
    var events = {};

    return {
      on: {
        enumerable: true,
        value: function (event, func, once) {
          var self = this;
          events[event] = events[event] || [];
          events[event].include(once ? function onceWrapper() {
            func.apply(this, arguments);
            return once;
          } : func);
          return this;
        }
      },

      fireEvent: {
        enumerable: true,
        value: function (event, args) {
          var funcs = events[event] || [], i, ln, once, toRemove = [];
          for (i = 0, ln = funcs.length; i < ln; i += 1) {
            try {
              once = funcs[i].apply(this, arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : Array.from(args));
              if (once) {
                toRemove.include(funcs[i]);
              }
            } catch (e) {
              console.log('error calling function mapped to event "' + event + '": ', e, e.message, funcs[i]);
            }
          }
          
          while (toRemove.length > 0) {
            this.removeListener(event, toRemove.shift());
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
