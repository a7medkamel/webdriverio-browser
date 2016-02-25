define([
    'sinon'
  ],
  function(sinon) {
    function stub() {
      return {
        get    : sinon.stub(),
        post   : sinon.stub(),
        put    : sinon.stub(),
        patch  : sinon.stub(),
        delete : sinon.stub(),
        upload : sinon.stub(),
        ajax   : sinon.stub(),
        batch  : sinon.stub()
      };
    }

    return {
      stub: stub
    };
  });