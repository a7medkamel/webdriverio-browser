define(['sinon'], function (sinon) {

  function createChannelMock() {
    return {
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
      patch: sinon.stub(),
      delete: sinon.stub(),
      ajax: sinon.stub(),
      jq_ajax_adapter: sinon.stub()
    };
  }

  return {
    createChannel: createChannelMock
  };

});
