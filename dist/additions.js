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

  /* unsuported capabilities fix */
  if (typeof Object.defineProperty !== 'function') {
    Object.defineProperty = function (obj, prop, descriptor) {
      if (descriptor.value) {
        obj[prop] = descriptor.value;
      } else {
        if (descriptor.get) {
          obj.__defineGetter__(prop, descriptor.get);
        }
        if (descriptor.set) {
          obj.__defineGetter__(prop, descriptor.set);
        }
      }
    };
  }

  if (typeof Object.defineProperties !== 'function') {
    Object.defineProperties = function (obj, properties) {
      var key;
      for (key in properties) {
        Object.defineProperty(obj, key, properties[key]);
      }
    };
  }

  if (typeof Object.keys !== 'function') {
    Object.keys = function (obj) {
      var key, keys = [];

      for (key in obj) {
        keys.push(key);
      }

      return keys;
    };
  }

  if (typeof Function.prototype.bind !== 'function') {
    Object.defineProperty(Function.prototype, 'bind', {
      value: function (bound) {
        var self = this;
        return function () {
          return self.apply(bound, arguments);
        }
      }
    })
  }

  (function () {
    /*
     * classList.js: Cross-browser full element.classList implementation.
     * 2011-06-15
     *
     * By Eli Grey, http://eligrey.com
     * Public Domain.
     * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     */

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

    if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

    (function (view) {

    "use strict";

    var
        classListProp = "classList"
      , protoProp = "prototype"
      , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
      , objCtr = Object
      , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      }
      , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
            i = 0
          , len = this.length
        ;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      , ClassList = function (elem) {
        var
            trimmedClasses = strTrim.call(elem.className)
          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
          , i = 0
          , len = classes.length
        ;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.className = this.toString();
        };
      }
      , classListProto = ClassList[protoProp] = []
      , classListGetter = function () {
        return new ClassList(this);
      }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
      return this[i] || null;
    };
    classListProto.contains = function (token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function (token) {
      token += "";
      if (checkTokenAndGetIndex(this, token) === -1) {
        this.push(token);
        this._updateClassName();
      }
    };
    classListProto.remove = function (token) {
      token += "";
      var index = checkTokenAndGetIndex(this, token);
      if (index !== -1) {
        this.splice(index, 1);
        this._updateClassName();
      }
    };
    classListProto.toggle = function (token) {
      token += "";
      if (checkTokenAndGetIndex(this, token) === -1) {
        this.add(token);
      } else {
        this.remove(token);
      }
    };
    classListProto.toString = function () {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(self));

    }
  }());

  exports['HTMLDocument'] = exports['HTMLDocument'] ||
                            Document;

  /* Object */
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

    same: {
      value: function (a, b) {
        var key, i, ln;
        if (a === null || b === null) {
          return a === b;
        }

        if (typeof a === 'object' && typeof b === 'object') {
          if (Array.isArray(a) && Array.isArray(b)) {
            return a.length === b.length && a.every(function (value, index) {
              return Object.same(value, b[index]);
            });
          } else {
            return Array.isArray(a) === Array.isArray(b) &&
                    Object.keys(a).length === Object.keys(b).length &&
                    Object.every(a, function (value, key) {
                      return Object.same(a[key], b[key]);
                    });
          }
        }

        return a === b;
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
          map[key] = func(obj[key], key, obj);
        }

        return map;
      }
    },

    some: {
      value: function (obj, func) {
        var key, some = true;

        for (key in obj) {
          some = func(obj[key], key, obj);

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
          if (!func(obj[key], key, obj)) {
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
          if (func(obj[key], key, obj)) {
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
          if (func(obj[key], key, obj)) {
            ret = key;
          }
        }
        return ret;
      }
    },

    keyOf: {
      value: function (obj, value) {
        return Object.match(obj, function (item) {
          return value === item;
        });
      }
    },

    lastKeyOf: {
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

    'implements': {
      value: function (source, I) {
        if (source && I && typeof I === 'object') {
          return Object.every(I, function (value, key) {
            return Object.isDefined(source[key]) && Object.same(source[key], value);
          });
        }

        return false;
      }
    },

    describe: {
      value: function (obj, depth) {
        var key, i, ln, ret, cr;
        if (typeof obj === 'object') {
          if (obj === null) {
            return 'null';
          } else if (Array.isArray(obj)) {
            depth = depth || 1;
            cr = '\n' + '\t'.repeat(depth);
            ret = '[' + cr;

            for (i = 0, ln = obj.length; i < ln; i += 1) {
              ret += Object.describe(obj[i], depth + 1) + ',' + cr;
            }

            ret = ret.substring(0, ret.length - cr.length - 1) + '\n' + '\t'.repeat(depth - 1) + ']';
            return ret;
          } else {
            depth = depth || 1;
            cr = '\n' + '\t'.repeat(depth);
            ret = '{' + cr;
            for (key in obj) {
              ret += key + ': ' + Object.describe(obj[key], depth + 1) + ',' + cr;
            }
            // remove last comma and CR, and close object description
            ret = ret.substring(0, ret.length - cr.length - 1) + '\n' + '\t'.repeat(depth - 1) + '}';
            return ret;
          }
        }

        return typeof obj === 'undefined' ? 'undefined' : obj.toString();
      }
    },

    properties: {
      value: function (obj) {
        var copy = {}, key;

        for (key in obj) {
          if (typeof obj[key] !== 'function') {
            copy[key] = obj[key];
          }
        }

        return copy;
      }
    }
  });


  /* Function.prototype */
  Object.defineProperties(Function.prototype, {
    'extends': {
      value: function (properties) {
        Object.defineProperties(this, properties);
        return this;
      }
    },

    'implements': {
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


  /* Array */
  Object.defineProperties(Array, {
    from: {
      value: function (obj) {
        return Array.isArray(obj) ? obj : [obj];
      }
    }
  });

  /* Array.prototype */
  Object.defineProperties(Array.prototype, {
    first: {
      get: function () {
        return this[0];
      }
    },

    last: {
      get: function () {
        return this[this.length - 1];
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


  /* Number.prototype */
  Object.defineProperties(Number.prototype, {
    bounds: {
      value: function (min, max) {
        return (new Number.Range(min, max)).limit(this);
      }
    }
  });


  /* HTMLDocument.prototype */
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

  /* HTMLElement.prototype */
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

    getPosition: {
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


  /* String.prototype */
  Object.defineProperties(String.prototype, {
    contains: {
      value: function (substr) {
        return this.indexOf(substr) > -1;
      }
    },

    repeat: {
      value: function (times, separator) {
        var i, ln, ret = '';
        times = typeof times === 'number' ? Math.max(0, times) : 1;
        separator = separator || '';

        for (i = 0, ln = times; i < ln; i += 1) {
          ret += this + separator;
        }

        return ret.substring(0, ret.length - separator.length);
      }
    },

    wrapTag: {
      value: function (tag, indent) {
        return '<' + tag + '>' + (indent ? ('\n' + '\t'.repeat(indent)) : '') + this + (indent ? '\n' : '') + '</' + tag + '>';
      }
    }
  });


  /* Math */
  Object.defineProperties(Math, {
    randomInt: {
      value: function (min, max) {
        var r = new Number.Range(min, max);
        return Math.floor(r.min + Math.random() * (r.max - r.min + 1));
      }
    }
  });

}(typeof exports === 'undefined' ? window : exports));


(function (exports) {
  "use strict";

  Number.Range = function (min, max) {
    max = typeof max === 'number' ? max : (min ? 0 : 100);
    min = min || 0;

    this.min = Math.min(min, max);
    this.max = Math.max(min, max);
  };

  Number.Range.implements({
    limit: {
      enumerable: true,
      value: function (value) {
        return Math.max(this.min, Math.min(value, this.max));
      }
    }
  });

}(typeof exports === 'undefined' ? window : exports));


(function (exports) {
  "use strict";

  var Color = exports.Color = function (r, g, b, a) {
    this.red = r || Math.randomInt(255);
    this.green = g || Math.randomInt(255);
    this.blue = b || Math.randomInt(255);
    this.alpha = typeof a === 'number' ? new Range(1).limit(a) : 1;
  };

  Color.extends({
    fromRGB: {
      value: function (r, g, b) {
        return new Color(r, g, b);
      }
    },

    fromRGBA: {
      value: function (r, g, b, a) {
        return new Color(r, g, b, a);
      }
    },

    fromHex: {
      value: function (r, g, b) {
        var h;
        if (arguments.length === 1) {
          h = r.replace('#', '');
          r = h.substring(0, 2);
          g = h.substring(2, 4);
          b = h.substring(4, 6);
        }
        return new Color(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
      }
    }
  })

  Color.implements({
    toRGB: {
      enumerable: true,
      value: function () {
        return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue +')';
      }
    },

    toRGBA: {
      enumerable: true,
      value: function () {
        return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
      }
    },

    toHexPart: {
      value: function (n) {
        var str = '0123456789ABCDEF';

        n = parseInt(n, 10);
        if (isNaN(n)) {
          n = 0;
        }
        n = new Number.Range(255).limit(n);

        return str.charAt((n - n % 16) / 16) + str.charAt(n % 16);
      }
    },

    toHex: {
      enumerable: true,
      value: function (prefix) {
        return (prefix ? '#' : '') + this.toHexPart(this.red) + this.toHexPart(this.green) + this.toHexPart(this.blue);
      }
    }
  });

}(window));


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
    },
    
    html: function (text) {
      this.innerHTML = text;
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

      fireEvent: {
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

      add: {
        enumerable: true,
        value: function (options) {
          var item = new Type(options);
          collection.push(item);
          return item;
        }
      }
    };
  };

}(typeof exports === 'undefined' ? window : exports));


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


