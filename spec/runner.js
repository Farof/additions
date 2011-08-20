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
    
    implements: function (a, b) {
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
        title = last.querySelector('.testsuite-title'),
        all = document.$('#tests');

      title.textContent = title.textContent + ' (' + (nb - failed) + '/' + nb + ')'

      if (nb === 0) {
        last.classList.add('empty');
      }

      if (failed === 0) {
        last.classList.add('passed');
      }

      all.$('h1').textContent = 'Tests (' + all.$$('.test.passed').length + '/' + all.$$('.test').length + ')';
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
