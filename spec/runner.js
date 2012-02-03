(function (exports) {
  "use strict";

  var assert = {
    equal: function (a, b) {
      var passed = a === b;
      return {
        passed: passed,
        msg: (passed ? (Object.describe(a).wrapTag('pre') + '\nequals\n' + Object.describe(b).wrapTag('pre')) : ('expected\n' + Object.describe(a).wrapTag('pre') + '\nto equal\n' + Object.describe(b).wrapTag('pre'))),
        isHTML: true
      };
    },

    notEqual: function (a, b) {
      var passed = a !== b;
      return {
        passed: passed,
        msg: (passed ? (Object.describe(a).wrapTag('pre') + '\nis not equal to\n' + Object.describe(b).wrapTag('pre')) : (Object.describe(a).wrapTag('pre') + '\nshould\'nt be equal to\n' + Object.describe(b).wrapTag('pre'))),
        isHTML: true
      };
    },

    same: function (a, b) {
      var passed = Object.same(a, b);
      return {
        passed: passed,
        msg: (passed ? (Object.describe(a).wrapTag('pre') + '\nis equivalent to\n' + Object.describe(b).wrapTag('pre')) : (Object.describe(a).wrapTag('pre') + '\nshould be equivalent to\n' + Object.describe(b).wrapTag('pre'))),
        isHTML: true
      };
    },
    
    'implements': function (a, b) {
      var passed = Object.implements(a, b);
      return {
        passed: passed,
        msg: passed ? (Object.describe(a).wrapTag('pre') + '\nimplements\n' + Object.describe(b).wrapTag('pre')) : (Object.describe(a).wrapTag('pre') + '\nshould implement\n' + Object.describe(b).wrapTag('pre')),
        isHTML: true
      }
    },

    type: function (item, type) {
      var passed = typeof item === type;
      return {
        passed: passed,
        msg: (passed ? (Object.describe(item).wrapTag('pre') + '\nis of type "' + type + '"') : ('expected\n' + Object.describe(item).wrapTag('pre') + '\nto be of type "' + type + '"')),
        isHTML: true
      }
    },

    isDefined: function (value) {
      var passed = value !== null && value !== (function () {}());
      return {
        passed: passed,
        msg: (passed ? (Object.describe(value).wrapTag('pre') + '\nis defined') : (Object.describe(value).wrapTag('pre') + '\nshould be defined')),
        isHTML: true
      }
    },

    isUndefined: function (value) {
      var passed = value === null || value === (function () {}());
      return {
        passed: passed,
        msg: (passed ? (Object.describe(value).wrapTag('pre') + '\nis undefined') : (Object.describe(value).wrapTag('pre') + '\nshould be undefined')),
        isHTML: true
      };
    },

    isTrue: function (value) {
      var passed = value === true;
      return {
        passed: passed,
        msg: (passed ? (Object.describe(value).wrapTag('pre') + '\nis true') : (Object.describe(value).wrapTag('pre') + '\nshould be true')),
        isHTML: true
      };
    },

    isFalse: function (value) {
      var passed = value === false;
      return {
        passed: passed,
        msg: (passed ? (Object.describe(value).wrapTag('pre') + '\nis false') : (Object.describe(value).wrapTag('pre') + '\nshould be false')),
        isHTML: true
      };
    },

    between: function (value, min, max) {
      var passed = value >= min && value <= max;
      return {
        passed: passed,
        msg: passed ? (value + ' is between ' + min + ' and ' + max) : (value + ' should be between ' + min + ' and ' + max)
      };
    },

    error: function (func) {
      var passed = false;

      try {
        func();
      } catch (e) {
        passed = true;
      }

      return {
        passed: passed,
        msg: (passed ? (Object.describe(func).wrapTag('pre') + '\nthrowed an error') : ('expected\n' + Object.describe(func).wrapTag('pre') + '\nto throw an error')),
        isHTML: true
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

    stackPush: function (name, bypass) {
      var suite = new Element('div', {
        'class': 'testsuite'
      }).grab(
        new Element('h2', {
          'class': 'testsuite-title',
          text: name
        })
      ), timer;

      suite.setAsync = function (delay) {
        var
          title = suite.querySelector('.testsuite-title'),
          i = 0,
          update = function () {
            i += 1;
            if (i * 50 > delay) {
              clearInterval(timer);
              title.textContent = name + ' (validation in 0ms)';
            } else {
              title.textContent = name + ' (validation in ' + (delay - i * 50) + 'ms)';
            }
          };
        suite.classList.add('asyncPending');
        timer = setInterval(update, 50);
      };

      suite.stopAsync = function () {
        clearInterval(timer);
        suite.classList.remove('asyncPending');
        suite.querySelector('.testsuite-title').textContent = name;
      };

      this.stack.last.appendChild(suite);
      this.stack.push(suite);
      return suite;
    },

    stackPop: function () {
      return this.stack.pop();
    },

    suite: function (name, callback, asyncTimer) {
      var
        suite = this.stackPush(name),
        wrapper = assertWrapper(suite),
        asyncValidation,
        error = false,
        fail = function (err) {
          suite.grab(this.getTestNode(
            'failed',
            'ERROR',
            err.message
          ));
        }.bind(this),
        after;

      try {
        asyncValidation = callback(wrapper);
        if (typeof asyncValidation === 'function') {
          asyncTimer = asyncTimer || 1000;
          suite.setAsync(asyncTimer);
          setTimeout(function () {
            try {
              asyncValidation(wrapper);
              after();
            } catch (err) {
              fail(err);
            }
          }, asyncTimer);
        }
      } catch (err) {
        fail(err);
      }

      after = this.afterSuite(typeof asyncValidation === 'function');

      if (typeof asyncValidation !== 'function') {
        after();
      }
    },

    afterSuite: function (async) {
      var
        last = this.stackPop(),
        all = document.$('#tests'),
        pending = all.querySelectorAll('.asyncPending'),
        title = all.$('h1'),
        setGlobalTitle = function () {
          pending = all.querySelectorAll('.asyncPending').length;
          title.textContent = 'Tests (' + all.$$('.test.passed').length + '/' + all.$$('.test').length + ')' + ((typeof pending === 'number' && pending > 0) ? ' (' + pending + ' async validation pending)' : '');
          if (typeof pending === 'number' && pending > 0) {
            title.classList.add('hasAsyncPending');
          } else {
            title.classList.remove('hasAsyncPending');
          }
        };

        
      if (pending.length > 0) {
        setGlobalTitle();
      }

      return function () {
        var
          nb = last.querySelectorAll('.test').length,
          failed = last.querySelectorAll('.failed').length,
          title = last.querySelector('.testsuite-title');

        if (last.classList.contains('asyncPending')) {
          last.stopAsync();
        }
        title.textContent = title.textContent + ' (' + (nb - failed) + '/' + nb + ')'

        if (nb === 0) {
          last.classList.add('empty');
        }

        if (failed === 0) {
          last.classList.add('passed');
        }

        setGlobalTitle();
      };
    },

    write: function (suite, test) {
      suite.grab(
        this.getTestNode(
          (test.passed ? 'passed' : 'failed'),
          (test.passed ? 'OK' : 'FAIL') + (test.name ? (': ' + test.name) : ''),
          test.msg,
          test.isHTML
        )
      );
    },

    getTestNode: function (status, statusMsg, detail, isHTML) {
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
          isHTML ?
            new Element('p', {
              html: detail
            }) :
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
