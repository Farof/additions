(function (exports) {
  "use strict";

  var assert = {
    equal: function (a, b) {
      var passed = a === b;
      return {
        passed: passed,
        msg: passed ? (a + ' equals ' + b) : ('expected ' + a + ' to equal ' + b)
      };
    },
    
    same: function (a, b) {
      var passed = Object.same(a, b);
      return {
        passed: passed,
        msg: passed ? (a + ' is equivalent to ' + b) : (a + ' should be equivalent to ' + b)
      };
    },

    type: function (item, type) {
      var passed = typeof item === type;
      return {
        passed: passed,
        msg: passed ? (item + ' is of type "' + type + '"') : ('expected ' + item + ' to be of type "' + type + '"')
      }
    },

    isDefined: function (value) {
      var passed = value !== null && value !== (function () {}());
      return {
        passed: passed,
        msg: passed ? (value + ' is defined') : (value + ' should be defined')
      }
    },

    isUndefined: function (value) {
      var passed = value === null || value === (function () {}());
      return {
        passed: passed,
        msg: passed ? (value + ' is undefined') : (value + ' should be undefined')
      };
    },

    isTrue: function (value) {
      var passed = value === true;
      return {
        passed: passed,
        msg: passed ? (value + ' is true') : (value + ' should be true')
      };
    },

    isFalse: function (value) {
      var passed = value === false;
      return {
        passed: passed,
        msg: passed ? (value + ' is false') : (value + ' should be false')
      };
    }
  };

  var assertWrapper = function (suite) {
    var key, wrapper = {};

    for (key in assert) {
      wrapper[key] = (function (key) {
        return function () {
          runner.write(suite, assert[key].apply(this, arguments));
        };
      }(key))
    }

    return wrapper;
  };

  var runner = exports.runner = {
    stack: [document.getElementById('tests')],

    stackPush: function (name) {
      var suite = new Element('div', {
        'class': 'testsuite'
      }).grab(
        new Element('h2', {
          'class': 'testsuite-title',
          text: name
        })
      );
      this.stack.last.appendChild(suite);
      this.stack.push(suite);
      return suite;
    },

    stackPop: function () {
      return this.stack.pop();
    },

    suite: function (name, callback) {
      var
        suite = this.stackPush(name),
        error = false;
      try {
        callback(assertWrapper(suite));
      } catch (err) {
        suite.grab(this.getTestNode(
          'failed',
          'ERROR',
          err.message
        ));
      }
      
      this.afterSuite();
    },

    afterSuite: function () {
      var
        last = this.stackPop(),
        nb = last.querySelectorAll('.test').length,
        failed = last.querySelectorAll('.failed').length,
        title = last.querySelector('.testsuite-title');

      title.textContent = title.textContent + ' (' + (nb - failed) + '/' + nb + ')'

      if (failed === 0) {
        last.classList.add('passed');
      }
    },

    write: function (suite, test) {
      suite.grab(
        this.getTestNode(
          (test.passed ? 'passed' : 'failed'),
          (test.passed ? 'OK' : 'FAIL') + (test.name ? (': ' + test.name) : ''),
          test.msg
        )
      );
    },
    
    getTestNode: function (status, statusMsg, detail) {
      return new Element('div', {
        'class': 'test ' + status
      }).adopt(
        new Element('p', {
          'class': 'test-result',
          text: statusMsg
        }),

        new Element('div', {
          'class': 'test-detail'
        }).grab(
          new Element('p', {
            text: detail
          })
        )
      )
    },

    cleanSandbox: function () {
      document.getElementById('sandbox').empty();
    },

    toggleShowPassed: function (e) {
      document.getElementById('tests').classList.toggle('hidePassed');
    }
  };

}(typeof exports === 'undefined' ? window : exports));
