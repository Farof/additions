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
