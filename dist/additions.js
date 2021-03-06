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
          obj.__defineSetter__(prop, descriptor.set);
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

    extend: {
      value: function (obj, I) {
        Object.defineProperties(obj, I);
        return obj;
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
          if (typeof obj[key] !== 'function' && ((obj.constructor && obj.constructor !== Object) ? obj.constructor.prototype.propertyIsEnumerable(key) : true)) {
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
        return Array.isArray(obj) ?
                obj :
                (obj === Object.undefined ? 
                  [] : 
                  ((typeof obj === 'object' && typeof obj.length === 'number') ?
                    Array.prototype.slice.call(obj) : 
                    [obj])
                );
      }
    }
  });

  /* Array.prototype */
  Object.defineProperties(Array.prototype, {
    clone: {
      value: function () {
        return this.concat();
      }
    },

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
    },

    every: {
      value: function (func) {
        var i, ln;

        for (i = 0, ln = this.length; i < ln; i += 1) {
          if (!func(this[i], i, this)) {
            return false;
          }
        }

        return true;
      }
    },

    some: {
      value: function (func) {
        var i, ln;

        for (i = 0, ln = this.length; i < ln; i += 1) {
          if (func(this[i], i, this)) {
            return true;
          }
        }

        return false;
      }
    },
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
    }
  });

  /* HTMLElement */
  Object.defineProperties(HTMLElement, {
    ClientRectOverload: {
      value: {
        centerX: {
          enumerable: true,
          get: function () {
            return (this.left + this.right) / 2;
          }
        },

        centerY: {
          enumerable: true,
          get: function () {
            return (this.top + this.bottom) / 2;
          }
        }
      }
    }
  });

  /* HTMLElement.prototype */
  Object.defineProperties(HTMLElement.prototype, {
    $: Object.getOwnPropertyDescriptor(HTMLDocument.prototype, '$'),

    $$: Object.getOwnPropertyDescriptor(HTMLDocument.prototype, '$$'),

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
        Array.prototype.forEach.call(arguments.length === 1 ? Array.from(arguments[0]) : arguments, this.grab.bind(this));
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
          rect = this.getBoundingClientRect(),
          parentRect = (topParent || document.body).getBoundingClientRect(),
          coord = Object.create({}, HTMLElement.ClientRectOverload);

          coord.left = rect.left - parentRect.left;
          coord.top = rect.top - parentRect.top;
          coord.width = rect.width;
          coord.height = rect.height;
          coord.right = coord.left + rect.width;
          coord.bottom = coord.top + rect.height;

          return coord;
      }
    },

    /*getPosition: {
      enumerable: true,
      value: function (topParent) {
        var
          parent,
          node = this,
          coord = {
            left: node.offsetLeft,
            top: node.offsetTop
          };

        topParent = topParent || document.body;
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
      },
    }*/

    setDragAction: {
      value: function (action, options) {
        var
          container = options.container || document,
          mouseup = function (e) {
            container.removeEventListener('mousemove', action, false);
            container.removeEventListener('mouseup', mouseup, false);
          };

        action = action.bind(this);

        this.addEventListener('mousedown', function (e) {
          e.stop();
          container.addEventListener('mousemove', action, false);
          container.addEventListener('mouseup', mouseup, false);
        }, false);

        if (typeof options.mousedown === 'function') {
          this.addEventListener('mousedown', options.mousedown, false);
        }
        if (typeof options.mouseup === 'function') {
          this.addEventListener('mouseup', options.mouseup, false);
        }

        return this;
      }
    },

    setAbsolute: {
      value: function (bound) {
        var
          pos = this.getPosition(bound);

        this.style.left = pos.left + 'px';
        this.style.top = pos.top + 'px';
        this.style.position = 'absolute';

        return this;
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
    min: {
      enumerable: true,
      writable: true,
      value: 0
    },

    max: {
      enumerable: true,
      writable: true,
      value: 100
    },

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


(function (exports) {
  "use strict";

  var Color = exports.Color = function (options) {
    options = options || {};
    this.red = options.red;
    this.green = options.green;
    this.blue = options.blue;
    this.alpha = options.alpha;
  };

  Color.extends({
    toHexPart: {
      value: function (p) {
        p = parseInt(p, 10);
        if (isNaN(p)) {
          return '00';
        }
        return '0123456789ABCDEF'.charAt((p - p % 16) / 16) +
               '0123456789ABCDEF'.charAt(p % 16)
      }
    },

    rgbaReg: {
      value: /^(?:rgba\()?((?:\d{1,3},?(?:\s*)?){3})(?:,?(?:\s*)?(1|0(?:\.\d+)?))?\)?;?$/
    },

    hexReg: {
      value: /^(#?)[\dabcdefABCDEF]{6}$/
    },

    hsvReg: {
      value: /^.*$/
    },

    cutHex: {
      value: function (h) {
        return h.charAt(0) === '#' ? h.substring(1,7) : h;
      }
    },

    isRGBA: {
      enumerable: true,
      value: function (rgba) {
        var matches;

        if (!this.rgbaReg.test(rgba)) {
          return false;
        } else {
          matches = this.rgbaReg.exec(rgba);
          if (matches && matches[1]) {
            return matches[1].replace(/(,\s|\s|,)/g, ':').split(':').every(function (match, index) {
              return match >= 0 && match <= 255;
            }) && (matches[2] ? (matches[2] >= 0 && matches[2] <= 1) : true);
          }
          return false;
        }
      }
    },

    isHex: {
      enumerable: true,
      value: function (h) {
        return this.hexReg.test(h);
      }
    },

    isHSV: {
      enumerable: true,
      value: function (hsv) {
        return this.hsvReg.test(hsv);
      }
    },

    fromRGBA: {
      enumerable: true,
      value: function (rgba) {
        var matches, matchesRGB, alpha;

        if (this.isRGBA(rgba)) {
          matches = this.rgbaReg.exec(rgba), matchesRGB = matches[1].replace(/(,\s|\s|,)/g, ':').split(':');
          alpha = Number(matches[2]);
          return new Color({
            red: parseInt(matchesRGB[0], 10),
            green: parseInt(matchesRGB[1], 10),
            blue: parseInt(matchesRGB[2], 10),
            alpha: (typeof alpha === 'number') ? (alpha * 255) : 255
          });
        }
        return null;
      }
    },

    fromHex: {
      enumerable: true,
      value: function (h) {
        if (this.isHex(h)) {
          return new Color({
            red: parseInt(this.cutHex(h).substring(0, 2), 16),
            green: parseInt(this.cutHex(h).substring(2, 4), 16),
            blue: parseInt(this.cutHex(h).substring(4, 6), 16),
            alpha: 255
          });
        }
        return null;
      }
    },

    fromHSV: {
      enumerable: true,
      value: function (hsv) {
        var matches;

        if (this.isHex(hsv)) {
          matches = this.hsvReg.exec(hsv);
          return new Color({
            
          });
        }
        return null;
      }
    },

    channel: {
      value: {
        red:    0,
        green:  1,
        blue:   2,
        alpha:  3
      }
    }
  });

  Color.implements(new Events());

  Color.implements({
    _red:   { writable: true, enumerable: false, value: 0   },
    _green: { writable: true, enumerable: false, value: 0   },
    _blue:  { writable: true, enumerable: false, value: 0   },
    _alpha: { writable: true, enumerable: false, value: 255 },

    red: {
      get: function () {
        return this._red;
      },
      set: function (value) {
        var changed;

        value = typeof value === 'number' ? Math.max(0, Math.min(value, 255)) : this._red;
        changed = value !== this._red;

        this._red = value;

        if (changed) {
          this.fireEvent('change:red');
        }
      },
      enumerable: true
    },

    green: {
      get: function () {
        return this._green;
      },
      set: function (value) {
        var changed;

        value = typeof value === 'number' ? Math.max(0, Math.min(value, 255)) : this._green;
        changed = value !== this._green;

        this._green = value;

        if (changed) {
          this.fireEvent('change:green');
        }
      },
      enumerable: true
    },

    blue: {
      get: function () {
        return this._blue;
      },
      set: function (value) {
        var changed;

        value = typeof value === 'number' ? Math.max(0, Math.min(value, 255)) : this._blue;
        changed = value !== this._blue;

        this._blue = value;

        if (changed) {
          this.fireEvent('change:blue');
        }
      },
      enumerable: true
    },

    alpha: {
      get: function () {
        return this._alpha;
      },
      set: function (value) {
        var changed;

        value = typeof value === 'number' ? Math.max(0, Math.min(value, 255)) : this._alpha;
        changed = value !== this._alpha;

        this._alpha = value;

        if (changed) {
          this.fireEvent('change:alpha');
        }
      },
      enumerable: true
    },

    serialize: {
      enumerable: true,
      value: function () {
        return {
          red: this.red,
          green: this.green,
          blue: this.blue,
          alpha: this.alpha
        };
      }
    },

    set: {
      value: function (data) {
        var
          changed = (typeof data.red    === 'number'  && data.red   !== this.red)
                 || (typeof data.green  === 'number'  && data.green !== this.green)
                 || (typeof data.blue   === 'number'  && data.blue  !== this.blue)
                 || (typeof data.alpha  === 'number'  && data.alpha !== this.alpha),
          prev = this.clone();

        this.red = data.red;
        this.green = data.green;
        this.blue = data.blue;
        this.alpha = data.alpha;

        if (changed) {
          this.fireEvent('change', this, prev);
        }
        return this;
      }
    },

    scramble: {
      value: function (opaque) {
        this.set({
          red: Math.randomInt(255),
          green: Math.randomInt(255),
          blue: Math.randomInt(255),
          alpha: opaque ? 255 : Math.randomInt(255)
        });
        return this;
      }
    },

    reverse: {
      value: function () {
        this.set({
          red: 255 - this.red,
          green: 255 - this.green,
          blue: 255 - this.blue
        });
        return this;
      }
    },

    toCommaList: {
      value: function () {
        var alpha = (this.alpha / 255).toFixed(2);
        return this.red + ', ' + this.green + ', ' + this.blue + ', ' + (alpha === '1.00' ? '1' : alpha);
      }
    },

    toRGBA: {
      value: function () {
        return 'rgba(' + this.toCommaList() + ')';
      }
    },

    toHex: {
      value: function () {
        return '#' + Color.toHexPart(this.red) + Color.toHexPart(this.green) + Color.toHexPart(this.blue);
      }
    },

    toHSV: {
      value: function () {
        // console.log('HSV output not supported yet');
        return 'HSV';
      }
    },

    fromRGBA: {
      value: function (rgba) {
        var color = Color.fromRGBA(rgba);
        if (color) {
          this.set(color);
        }
        return this;
      }
    },

    fromHex: {
      value: function (h) {
        var color = Color.fromHex(h);
        if (color) {
          this.set(color);
        }
        return this;
      }
    },

    fromHSV: {
      value: function (hsv) {
        var color = Color.fromHSV(hsv);
        if (color) {
          this.set(color);
        }
        return this;
      }
    },

    clone: {
      value: function () {
        return new Color(this);
      }
    },

    toString: {
      value: function () {
        return JSON.stringify(this.serialize());
      }
    }
  });

}(window));


(function (exports) {
  "use strict";

  exports.Element = function (tag, options) {
    var element = document.createElement(tag), key;
    options = options || {};

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
      if (typeof styles === 'string') {
        str = styles;
      } else {
        for (style in styles) {
          str += style + ': ' + styles[style] + '; ';
        }
      }
      this.setAttribute('style', str);
    },

    text: function (text) {
      var textNode = document.createTextNode(text);
      this.appendChild(textNode);
    },
    
    html: function (text) {
      this.innerHTML = text;
    },

    Absolute: function (bound) {
      var self = this;
      document.addEventListener('DOMNodeInserted', function setAbsolute(e) {
        self.setAbsolute(bound);
        document.removeEventListener('DOMNodeInserted', setAbsolute, false);
      }, false);
    },

    Dragable: function (bound) {
      var
        offsetX,
        offsetY,
        boundPos = bound.getPosition();

      bound.style.position = 'relative';

      this.setDragAction(function (e) {
        this.style.left = e.clientX - boundPos.left - offsetX + 'px';
        this.style.top = e.clientY - boundPos.top - offsetY + 'px';
      }, {
        mousedown: function (e) {
          var pos = this.getPosition(bound);
          this.setAbsolute(bound);
          offsetX = e.clientX - boundPos.left - parseInt(this.style.left, 10);
          offsetY = e.clientY - boundPos.top - parseInt(this.style.top, 10);
          bound.appendChild(this);
        }
      })
    },

    properties: function (properties) {
      var key;

      for (key in properties) {
        this[key] = properties[key];
      }
    }
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


