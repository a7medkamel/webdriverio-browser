define(['lib/underscore', 'sinon'], function(_, sinon) {

  function generateMock(moduleExports, exportOverrides, instanceOverrides, singleInstance) {

    if (_.isFunction(moduleExports)) {
      if (!singleInstance) {
        return constructorMock(moduleExports, instanceOverrides);
      } else {
        var instance = objectMock(moduleExports.prototype, instanceOverrides),
          constructor = sinon.stub().returns(instance);
        _.extend(constructor, exportOverrides);
        constructor.instance = instance;
        return constructor;
      }
    }
    else if (_.isObject(moduleExports)) {
      return objectMock(moduleExports, exportOverrides);
    }
    return moduleExports;
  };

  function constructorMock(moduleExports, instanceOverrides) {
    var firstInstance = objectMock(moduleExports.prototype, instanceOverrides),
      instances = [],
      constructorFunc = function() {
        if (instances.length == 0) {
          instances.push(firstInstance);
          return firstInstance;
        } else {
          var instance = objectMock(moduleExports.prototype, instanceOverrides);
          instances.push(instance);
          return instance;
        }
      },
      result = _.extend(sinon.spy(constructorFunc), {
        instances : instances,
        instance : firstInstance
      });
    return result;
  };

  function objectMock(originalObject, overrides) {
    var result = _.extend({}, originalObject);
    _.each(result, function (value, key) {
      if (_.isFunction(value)) {
        result[key] = sinon.stub();
      };
    });
    return _.extend(result, overrides);
  };

  return {
    generate : generateMock,
    constructorMock : constructorMock
  };

});