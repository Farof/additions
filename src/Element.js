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
        boundPos = bound.getPos();

      bound.style.position = 'relative';

      this.setDragAction(function (e) {
        this.style.left = e.clientX - boundPos.x - offsetX + 'px';
        this.style.top = e.clientY - boundPos.y - offsetY + 'px';
      }, {
        mousedown: function (e) {
          var pos = this.getPos(bound);
          this.setAbsolute(bound);
          offsetX = e.clientX - boundPos.x - parseInt(this.style.left, 10);
          offsetY = e.clientY - boundPos.y - parseInt(this.style.top, 10);
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
