define([
  'lib/underscore',
  'lib/bluebird'
], function(_, Promise) {
  var StateManager = function() {}

  StateManager.prototype.setItem = function() {}

  var getItem = function(cache, id, cb) {
    var ids = _.isArray(id) ? _.uniq(id) : [id],
      statePromise,
      statePromises = [],
      states,
      state = {},
      i;

    for (i = 0; i < ids.length; i++) {
      statePromise = Promise.resolve({
        permanent: cache[ids[i]] || {},
        session: {}
      });
      statePromises.push(statePromise);
    }

    return Promise.all(statePromises).spread(function() {
      states = arguments;
      if (ids.length > 1) {
        //Combine all states into one object
        _.each(ids, function(id, i) {
          state[id] = states[i];
        });
      } else if (ids.length === 1) {
        state = arguments[0];
      }
      if (cb) {
        cb(null, state);
      }

      return state;
    }, function() {
      if (cb) {
        cb('error');
      }
    });
  }

  var stub = function(cache) {
    StateManager.prototype.getItem = function(id, cb) {
      return getItem(cache, id, cb);
    }

    return StateManager;
  }

  return {
    stub: stub
  };
});
