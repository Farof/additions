/*
The MIT License (MIT)

Copyright (c) 2011 Mathieu Merdy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


/* START EXTERNAL LIB */
/*
Copyright (c) 2010 Robert Kieffer

Dual licensed under the MIT and GPL licenses.
*/
(function() {
  /*
* Generate a RFC4122(v4) UUID
*
* Documentation at https://github.com/broofa/node-uuid
*/

  // Use node.js Buffer class if available, otherwise use the Array class
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Buffer used for generating string uuids
  var _buf = new BufferClass(16);

  // Cache number <-> hex string for octet values
  var toString = [];
  var toNumber = {};
  for (var i = 0; i < 256; i++) {
    toString[i] = (i + 0x100).toString(16).substr(1).toUpperCase();
    toNumber[toString[i]] = i;
  }

  function parse(s) {
    var buf = new BufferClass(16);
    var i = 0, ton = toNumber;
    s.toUpperCase().replace(/[0-9A-F][0-9A-F]/g, function(octet) {
      buf[i++] = toNumber[octet];
    });
    return buf;
  }

  function unparse(buf) {
    var tos = toString, b = buf;
    return tos[b[0]] + tos[b[1]] + tos[b[2]] + tos[b[3]] + '-' +
           tos[b[4]] + tos[b[5]] + '-' +
           tos[b[6]] + tos[b[7]] + '-' +
           tos[b[8]] + tos[b[9]] + '-' +
           tos[b[10]] + tos[b[11]] + tos[b[12]] +
           tos[b[13]] + tos[b[14]] + tos[b[15]];
  }

  function uuid(fmt, buf, offset) {
    var b32 = 0x100000000, ff = 0xff;

    var b = fmt != 'binary' ? _buf : (buf ? buf : new BufferClass(16));
    var i = buf && offset || 0;

    r = Math.random()*b32;
    b[i++] = r & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;
    r = Math.random()*b32;
    b[i++] = r & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & 0x0f | 0x40; // See RFC4122 sect. 4.1.3
    b[i++] = (r=r>>>8) & ff;
    r = Math.random()*b32;
    b[i++] = r & 0x3f | 0x80; // See RFC4122 sect. 4.4
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;
    r = Math.random()*b32;
    b[i++] = r & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;
    b[i++] = (r=r>>>8) & ff;

    return fmt === undefined ? unparse(b) : b;
  };

  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof(module) != 'undefined') {
    module.exports = uuid;
  } else {
    // In browser? Set as top-level function
    this.uuid = uuid;
  }
})();


/* END EXTERNAL LIB */


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

  Object.defineProperties(Number.prototype, {
    bounds: {
      value: function (min, max) {
        return (new Number.Range(min, max)).limit(this);
      }
    }
  });

  Object.defineProperties(HTMLElement.prototype, {
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

}(typeof exports === 'undefined' ? window : exports));


(function (exports) {
  "use strict";

  Number.Range = function (min, max) {
    max = max || (min ? 0 : 100);
    min = min || 0;

    if (min > max) {
      [min, max] = [max, min];
    }

    this.min = min;
    this.max = max;
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


(function (exports) {
  "use strict";

  exports.Element = function (tag, options) {
    var element = document.createElement(tag), key;

    for (key in options) {
      if (exports.Element.Mutators[key]) {
        exports.Element.Mutators[key].call(element, options[key]);
      } else if (['string', 'number'].contains(typeof options[key])) {
        element.setAttribute(key, options[key]);
      } else {
        element[key] = options[key];
      }
    }

    return element;
  };

  exports.Element.Mutators = {
    events: function (events) {
      var
        event,
        func = function (func) {
          this.addEventListener(event, func, false);
        }.bind(this);

      for (event in events) {
        (Array.isArray(events[event]) ? events[event] : [events[event]]).forEach(func);
      }
    },

    style: function (styles) {
      var style, str = '';
      for (style in styles) {
        str += style + ': ' + styles[style] + '; ';
      }
      this.setAttribute('style', str);
    },

    text: function (text) {
      var textNode = document.createTextNode(text);
      this.appendChild(textNode);
    }
  };

}(typeof exports === 'undefined' ? window : exports));


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
          return this;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));


