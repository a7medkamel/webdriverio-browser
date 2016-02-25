define([
  'lib/underscore',
  'lib/backbone',
  'sinon',
  'component/test/mock/generator'
], function(
  _,
  Backbone,
  sinon,
  generator
) {

  'use strict';

  var modelOverrides = (function() {
    var overrides = _.pick(Backbone.Model.prototype,
      _.chain(Backbone.Model.prototype).functions()
        .difference(['sync', 'fetch', 'save', 'destroy'])
        .value()
    );

    Backbone.Model.apply(overrides);

    _.chain(overrides).functions().each(function(key) {
      sinon.spy(overrides, key);
    }).value();

    return overrides;
  })();

  return {
    Model: function(name, attributesOverride, instanceOverrides) {
      var Model;

      // TODO: [zhbliu] [underscore#1.7] replace 0 !== arguments.length with _.isEmpty(arguments). affects results in Phantomjs now.
      if (0 !== arguments.length && _.isString(name)) {
        Model = require(name);
      } else {
        Model = Backbone.Model;
        instanceOverrides = attributesOverride;
        attributesOverride = name;
      }

      return generator.constructorMock(
        Model,
        _.defaults({
          attributes: _.clone(attributesOverride)
        }, instanceOverrides, modelOverrides)
      );
    },

    View: function(name, instanceOverrides) {
      var View;

      // TODO: [zhbliu] [underscore#1.7] replace 0 !== arguments.length with _.isEmpty(arguments). affects results in Phantomjs now.
      if (0 !== arguments.length && _.isString(name)) {
        View = require(name);
      } else {
        View = Backbone.View;
        instanceOverrides = name;
      }

      var overrides = _.extend({
        render: sinon.stub().returnsThis(),
      }, instanceOverrides);

      return generator.constructorMock(View, overrides);
    }
  };
});