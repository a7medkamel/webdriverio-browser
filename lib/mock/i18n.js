define([
    'lib/underscore',
    'sinon',
  ],
  function(_, sinon) {
    function stub(options) {
      if (arguments.length) {
        if (_.isString(options)) {
          // if options is a template string, compile it if model is given.
          return {
            get: function(key, model) {
              // if model is not passed, directly return the key.
              return model ? _.template(options)(model) : key;
            }
          }
        } else if (_.isObject(options)) {
          return {
            get: function(key, model) {
              // if key exists in options, return the model-interpolated value, otherwise, return undefined.
              var value = _.result(options, key);
              if (_.isString(value)) {
                return _.template(value)(model);
              }

              return value;
            }
          }
        }
      }

      return {
        get: sinon.stub()
      }
    }

    return {
      stub: stub
    };
  });