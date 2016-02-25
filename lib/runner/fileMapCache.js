define(['lib/underscore',
  'mockInjector'], function (_) {
  'use strict';

  var global = window;

  function getModulesList(query) {
    var sessionData;
    if (!query) {
      return null;
    }
    sessionData = JSON.parse(sessionStorage.getItem('testFileMapCache') || '{}');
    if (!sessionData[query]) {
      return null;
    }
    return sessionData[query];
  }

  function collectModulesList(query) {
    var modulesList = [];
    if (!query) {
      return null;
    }

    wrapDefine();

    global.it = _.wrap(global.it, function (originalIt) {
      var testObject = originalIt.apply(this, Array.prototype.slice.call(arguments, 1));
      testObject.moduleName = window._fileMappingCache_contextModule;
      return testObject;
    });

    mocha.run = _.wrap(mocha.run, function (originalRun) {
      var runner = originalRun.apply(Array.prototype.slice.call(arguments, 1));
      runner.on('test', function (test) {
        if (!_.contains(modulesList, test.moduleName)) {
          modulesList.push(test.moduleName);
        }
      });
      runner.on('end', function () {
        saveModulesList(query, modulesList);
      })
    });
  }

  function wrapDefine() {
    var originalDefine = define,
      defineOverride = _.wrap(originalDefine, function (originalDefine, name, deps, callback) {
      var defineArgs = [];
      if (typeof name !== 'string') {
        callback = deps;
        deps = name;
        name = null;
      }

      if (!_.isArray(deps)) {
        callback = deps;
        deps = [];
      }

      var indexOfModule = _.indexOf(deps, 'module');
      if (indexOfModule == -1) {
        indexOfModule = deps.length;
        deps.push('module');
      }

      var wrappedCallback = _.isFunction(callback)
        ? _.wrap(callback, function (originalCallback) {
            var moduleObj = arguments[indexOfModule + 1],
                result;
            window._fileMappingCache_contextModule = moduleObj.id;
            result = originalCallback.apply(this, Array.prototype.slice.call(arguments, 1));
            window._fileMappingCache_contextModule = null;
          return result;
          })
        : callback;

      if (name) {
        defineArgs.push(name);
      }
      defineArgs.push(deps);
      defineArgs.push(wrappedCallback);
      return originalDefine.apply(this, defineArgs);
    });

    define = defineOverride;
    define.amd = originalDefine.amd;
  }

  function saveModulesList(query, modulesList) {
    var mappingObj = {};
    mappingObj[query] = modulesList;
    sessionStorage.setItem('testFileMapCache', JSON.stringify(mappingObj));
  }


  return {
    getModulesList: getModulesList,
    collectModulesList: collectModulesList
  };

});
