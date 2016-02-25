define(['lib/underscore',
  'component/test/mock/generator'], function (_, mockGenerator) {

  var originalDefine = define,
    modules = {};

  function createWrappedCallback(originalCallback, originalDeps) {
    if (!_.isFunction(originalCallback)) {
      return originalCallback;
    }

    return function () {
      // module object is available as the last argument after 'module'
      // explicitly pushed to dependencies list
      var moduleObj = arguments[arguments.length - 1],
        context = (!!window && _.contains(originalDeps, 'exports')) ? this : window;

      if (!moduleObj) {
        return originalCallback.apply(context, arguments);
      }
      var moduleExports = originalCallback.apply(context, arguments);

      if (!moduleExports && moduleObj.exports) {
        //must be using module.exports syntax
        moduleExports = moduleObj.exports;
      }

      modules[moduleObj.id] = {
        depNames: originalDeps,
        depModules: Array.prototype.slice.call(arguments, 0),
        factory: originalCallback,
        exports: moduleExports
      };
      return moduleExports;
    };
  };


  function defineOverride(name, deps, callback) {
    // standard requirejs params handling
    if (typeof name !== 'string') {
      callback = deps;
      deps = name;
      name = null;
    }

    if (!_.isArray(deps)) {
      callback = deps;
      deps = [];
    }

    var wrappedCallback = createWrappedCallback(callback, deps),
      defineArgs = [];
    deps.push('module');

    if (name) {
      defineArgs.push(name);
    }
    defineArgs.push(deps);
    defineArgs.push(wrappedCallback);
    return originalDefine.apply(this, defineArgs);
  };

  function buildArgsArray(moduleObj, dependencyOverrides, generatedMocks) {
    dependencyOverrides = dependencyOverrides || {};
    var isOverridesArray = _.isArray(dependencyOverrides),
      depth = _.isNumber(dependencyOverrides.$depth) ? dependencyOverrides.$depth : 1;

    if (!isOverridesArray && _.isArray(generatedMocks)) {
      dependencyOverrides = _.chain(generatedMocks)
        .filter(function (mock) {
          return !!mock.__dependencyName;
        })
        .map(function (mock) {
          return [mock.__dependencyName, mock];
        })
        .object()
        .defaults(dependencyOverrides)
        .value();
    }

    return _buildArgsArrayInt(moduleObj, dependencyOverrides, depth);
  };

  function _buildArgsArrayInt(moduleObj, dependencyOverrides, depth) {
    var args = [];
    _.each(moduleObj.depNames, function (key, index) {
      var mod = modules[key],
        override = dependencyOverrides[key];
      if (!override) {
        if (depth !== 1 && !!mod) {
          console.log('look deep');
          override = mod.factory.apply(this, _buildArgsArrayInt(mod, dependencyOverrides, depth - 1));
        } else {
          override = moduleObj.depModules[index];
        }
      }
      args.push(override || moduleObj.depModules[index]);
    });
    return args;
  };

  function getModuleFactory(name) {
    var module = modules[name];
    if (!module) {
      throw new Error('Module "' + name + '" is not registered.' +
        ' Please ensure that mockInjector plugin is loaded before any modules you try to resolve and their dependencies');
    }
    return function (dependencyOverrides, namedMocks) {
      var args = buildArgsArray(module, dependencyOverrides, namedMocks || []);
      var factory = module.factory.apply(this, args);

      if (!factory) {
        //could be using export syntax
        var factoryModuleIndex = _.indexOf(module.depNames, "module");
        if (module.depModules[factoryModuleIndex]) {
          return module.depModules[factoryModuleIndex].exports;
        }
      }

      return factory;
    };
  };

  function generateMock(moduleName, exportOverrides, instanceOverrides, singleInstance) {

    var module = modules[moduleName];
    if (!module) {
      throw new Error('Module "' + name + '" is not registered.' +
        ' Please ensure that mockInjector plugin is loaded before any modules you try to resolve');
    }
    var mock = mockGenerator.generate(module.exports, exportOverrides, instanceOverrides, singleInstance);
    mock.__dependencyName = moduleName;
    return mock;
  };


  // replace global define with override
  define = window.define = defineOverride;
  define.amd = originalDefine.amd;

  return {
    // plugin interface
    load: function (name, req, onload, config) {
      require([name], function () {
        var factory = getModuleFactory(name);
        factory.getNamedMock = generateMock;
        onload(factory);
      });
    },
    // getModuleWith interface
    getModuleWith: function (name, dependencyOverrides) {
      return getModuleFactory(name)(dependencyOverrides);
    },
    getNamedMock: generateMock
  };

});
