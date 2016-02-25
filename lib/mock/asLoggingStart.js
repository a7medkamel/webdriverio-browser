define(['sinon'], function(sinon) {
  'use strict';

  var stub;

  return {
    stub: function() {
      stub = sinon.stub(Function.prototype, 'asLoggingStart', function() {
        return this;
      });

      return stub;
    },
    restore: function() {
      stub.restore();
    }
  };
});
