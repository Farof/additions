(function (exports) {
  "use strict";

  Object.defineProperties(Object, {
    undefined: {
      value: (function () {}()),
      writable: false
    },

    isUndefined: {
      value: function (value) {
        return value === null || value === Object.undefined;
      }
    },

    isDefined: {
      value: function (value) {
        return !Object.isUndefined(value);
      }
    },

    forEach: {
      value: function (obj, func) {
        var key;
        for (key in obj) {
          func(obj[key], key);
        }
      }
    },

    map: {
      value: function (obj, func) {
        var key, map = {};

        for (key in obj) {
          map[key] = func(obj[key], key);
        }

        return map;
      }
    },

    some: {
      value: function (obj, func) {
        var key, some = true;

        for (key in obj) {
          some = func(obj[key], key);

          if (some) {
            return some;
          }
        }

        return some;
      }
    },

    every: {
      value: function (obj, func) {
        var key;
        for (key in obj) {
          if (!func(obj[key], key)) {
            return false;
          }
        }

        return true;
      }
    },

    match: {
      value: function (obj, func) {
        var key;
        for (key in obj) {
          if (func(obj[key], key)) {
            return key;
          }
        }
        return null;
      }
    },

    lastMatch: {
      value: function (obj, func) {
        var key, ret = null;
        for (key in obj) {
          if (func(obj[key], key)) {
            ret = key;
          }
        }
        return ret;
      }
    },

    indexOf: {
      value: function (obj, value) {
        return Object.match(obj, function (item) {
          return value === item;
        });
      }
    },

    lastIndexOf: {
      value: function (obj, value) {
        return Object.lastMatch(obj, function (item) {
          return value === item;
        });
      }
    },

    values: {
      value: function (obj) {
        var values = [], key;

        if (typeof obj !== 'object' || Array.isArray(obj)) {
          return obj;
        }

        for (key in obj) {
          values.push(obj[key]);
        }

        return values;
      }
    },

    merge: {
      value: function (source, adds) {
        var key;
        for (key in adds) {
          source[key] = adds[key];
        }
        return source;
      }
    },

    implements: {
      value: function (source, I) {
        if (source && I && typeof I === 'object') {
          return Object.every(I, function (value, key) {
            return Object.isDefined(source[key]);
          });
        }

        return false;
      }
    }
  });

  Object.defineProperties(Function.prototype, {
    extends: {
      value: function (properties) {
        Object.defineProperties(this, properties);
        return this;
      }
    },

    implements: {
      value: function (properties) {
        Object.defineProperties(this.prototype, properties);
        return this;
      }
    },

    delay: {
      value: function (delay, bind) {
        var func = this;
        setTimeout(function () {
          func.call(bind);
        }, delay);
      }
    },

    unshift: {
      value: function (arg, bind) {
        var func = this;
        return function () {
          return func.apply(bind || this, [arg].concat(Array.prototype.slice.call(arguments)));
        }
      }
    }
  });

  Object.defineProperties(Event.prototype, {
    stop: {
      enumerable: true,
      value: function () {
        this.stopPropagation();
        this.preventDefault();
        return this;
      }
    }
  });

  Object.defineProperties(Array.prototype, {
    first: {
      get: function () {
        return this[0];
      }
    },

    last: {
      get: function () {
        return this[this.lenght - 1];
      }
    },

    contains: {
      value: function (item) {
        return this.indexOf(item) > -1;
      }
    },

    match: {
      value: function (func) {
        var i, ln;

        for (i = 0, ln = this.length; i < ln; i += 1) {
          if (func(this[i], i, this)) {
            return this[i];
          }
        }

        return;
      }
    },

    lastMatch: {
      value: function (func) {
        var i, ln, ret;

        for (i = 0, ln = this.length; i < ln; i += 1) {
          if (func(this[i], i, this)) {
            ret = this[i];
          }
        }

        return ret;
      }
    },

    include: {
      value: function (item, pass) {
        if (!pass && Array.isArray(item)) {
          return this.merge(item);
        }
        if (!this.contains(item)) {
          this.push(item);
        }
        return this;
      }
    },

    merge: {
      value: function (items) {
        var i, ln;
        for (i = 0, ln = items.length; i < ln; i += 1) {
          this.include(items[i], true);
        }
        return this;
      }
    },

    remove: {
      value: function (item) {
        var i = this.indexOf(item);
        if (i > -1) {
          return this.splice(i, 1);
        }
        return null;
      }
    }
  });

  Object.defineProperties(Array, {
    from: {
      value: function (obj) {
        return Array.isArray(obj) ? obj : [obj];
      }
    }
  });

  Object.defineProperties(Number.prototype, {
    bounds: {
      value: function (min, max) {
        return (new Number.Range(min, max)).limit(this);
      }
    }
  });

  Object.defineProperties(HTMLDocument.prototype, {
    $: {
      enumerable: true,
      value: function () {
        return this.querySelector.apply(this, arguments);
      }
    },

    $$: {
      enumerable: true,
      value: function () {
        return this.querySelectorAll.apply(this, arguments);
      }
    },

    $$$: {
      enumerable: true,
      value: function () {
        return this.getElementById.apply(this, arguments);
      }
    }
  });

  Object.defineProperties(HTMLElement.prototype, {
    $: {
      enumerable: true,
      value: function () {
        return this.querySelector.apply(this, arguments);
      }
    },

    $$: {
      enumerable: true,
      value: function () {
        return this.querySelectorAll.apply(this, arguments);
      }
    },

    grab: {
      enumerable: true,
      value: function (node) {
        this.appendChild(node);
        return this;
      }
    },

    adopt: {
      enumerable: true,
      value: function () {
        Array.prototype.forEach.call(arguments, function (node) {
          this.grab(node);
        }.bind(this));
        return this;
      }
    },

    unload: {
      enumerable: true,
      value: function () {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
          return this;
        }
        return false;
      }
    },

    empty: {
      enumerable: true,
      value: function () {
        while (this.children[0]) {
          this.removeChild(this.children[0]);
        }
        return this;
      }
    },

    replaces: {
      enumerable: true,
      value: function (replaced) {
        if (replaced.parentNode) {
          replaced.parentNode.replaceChild(this, replaced);
        }
        return this;
      }
    },

    pos: {
      enumerable: true,
      value: function (topParent) {
        var
          parent,
          node = this,
          coord = {
            left: node.offsetLeft,
            top: node.offsetTop
          };

        topParent = topParent || document;
        parent = node.offsetParent;

        while (parent && parent !== topParent) {
          coord.left += parent.offsetLeft;
          coord.top += parent.offsetTop;
          parent = parent.offsetParent;
        }

        coord.right = coord.left + node.scrollWidth;
        coord.centerX = coord.left + node.scrollWidth / 2;
        coord.bottom = coord.top + node.scrollHeight;
        coord.centerY = coord.top + node.scrollHeight / 2;

        return coord;
      }
    }
  });

  Object.defineProperties(String.prototype, {
    contains: {
      value: function (substr) {
        return this.indexOf(substr) > -1;
      }
    }
  });

}(typeof exports === 'undefined' ? window : exports));
