define(['sinon',
  'lib/jquery',
  'lib/underscore',
  'lib/bluebird',
  'component/test/mock/http',
  'component/test/mock/generator']
, function (sinon, $, _, Promise, httpMock, mockGenerator) {

  function mockDeferred() {
    var deferred = $.Deferred(),
      promise = deferred.promise(),
      originalThen = promise.then;

    promise.withUiBlock = sinon.stub().returns(promise);
    deferred.withUiBlock = promise.withUiBlock;

    deferred.then = promise.then = function () {
      var result = originalThen.apply(this, arguments);
      promise.next = result;
      result.withUiBlock = sinon.stub().returns(result);
      return result;
    };

    return deferred;
  }

  function MockPromise() {
    var resolve, reject;
    var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    });

    promise.resolve = resolve;
    promise.reject  = reject;
    return promise;
  }

  MockPromise.useSync = function () {
    Promise._asyncScheduler = Promise.setScheduler(function(fn) {
      fn();
    });
  };

  MockPromise.restore = function () {
    if (Promise._asyncScheduler) {
      Promise.setScheduler(Promise._asyncScheduler);
    }
  };

  function viewMock(instanceOverrides) {
    var overrides = _.extend({
      initialize : sinon.stub(),
      render: sinon.stub().returnsThis(),
      dispose : sinon.stub(),
      remove: sinon.stub(),
      on : sinon.stub()
    }, instanceOverrides);
    return mockGenerator.constructorMock({}, overrides);
  }

  function i18nMock(data) {
    function getString(key) {
      var res = _.result(data, key, '');

      if (res) {
        if (arguments.length > 1) {
          var args = _.rest(_.toArray(arguments));

          res = res.replace(/{(\d+)}/gi, function(match, p1) {
            var index = parseInt(p1, 10);
            return _.isUndefined(args[index]) ? match : args[index];
          });
        }
      }

      return res || '';
    }

    return {
      getString: getString,
      getStringOrDefault: function(key, defaultValue) {
        return getString.apply(this, [key].concat(_.rest(_.toArray(arguments), 2))) || defaultValue;
      },
      get: function(key) {
        var template = _.chain(data)
                        .result(key, '')
                        .template()
                        .value();

        return template(arguments[1] || {});
      }
    };
  }

  function InstrumentationManagerMock() {
    this.init = sinon.stub();
    this.startActivity = sinon.stub().callsArg(1);
    this.logMessage = sinon.stub();
    this.logDuration = sinon.stub();
    this.extendStubOptions = sinon.stub();
  }

  Function.prototype.asLoggingStart = function () {
    var func = this;
    return function() {
      return func.apply(this, arguments);
    };
  };

  return {
    // Mocks deferred object. Used to create a mock deferred with any extensions it's expected to have
    Deferred               : mockDeferred,
    Promise                : MockPromise,
    // Stub parameterless constructor of window.Date to return a specific timestamp
    InstrumentationManager : InstrumentationManagerMock,
    createChannel          : httpMock.createChannel,
    viewConstructor        : viewMock,
    i18n                   : i18nMock
  };
});
