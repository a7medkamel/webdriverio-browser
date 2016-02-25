define([
  'sinon',
  'lib/underscore',
  'lib/backbone',
  'component/test/mock/backbone',
  'component/grid/index',
  'component/grid/layout/table'
], function(
  sinon,
  _,
  Backbone,
  BackboneMockGenerator
) {

  'use strict';

  var ProjectionMockGenerator = function(name) {
    var instanceOverrides = {
      pipe: function(to) {
        if (to) {
          to.src = this;
        }

        return to;
      },

      piped: function(to) {
        for (var from = this; from; from = from.src) {
          if (from === to) {
            return true;
          }
        }
        return false;
      },

      update: sinon.stub()
    };

    return BackboneMockGenerator.Model.apply(this, _.compact([name, {}, instanceOverrides]));
  };

  var LayoutMockGenerator = function() {
    var View = BackboneMockGenerator.View('component/grid/layout/table');
    return _.extend(View, {
      partial: sinon.spy(function(options) {
        return _.bind(Backbone.View.extend, View)({
          options: options
        });
      })
    });
  };

  var GridMockGenerator = function(attributes) {
    var Layout = LayoutMockGenerator(),
      Projection = ProjectionMockGenerator();

    var projection = new Projection();
    projection.set(attributes);

    return BackboneMockGenerator.View('component/grid/index', {
      layout     : new Layout(),
      projection : projection
    });
  };

  return {
    Grid       : GridMockGenerator,
    Projection : ProjectionMockGenerator,
    Layout     : LayoutMockGenerator
  };
});