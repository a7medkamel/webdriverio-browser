define(['lib/underscore', 'mockInjector'], function(){

  'use strict';

  mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
  });

  function run(specList){
    var specFile = document.location.pathname.indexOf('/list1/') !== -1 ?
      'spec/list1' :
      specList;

    require(['component/test/runner/index', specFile], function (runner, fullList) {

      var cachedModules = getCachedModulesList(runner);
      require([cachedModules || fullList], function(){
        if (window.__karma__) {
          window.__karma__.start();
        } else {
          mocha.run();
        }
      });
    });
  }

  function getCachedModulesList (runner) {
    var isWatch = document.location.pathname.indexOf('/watch/') > -1,
      modulesList;

    if(isWatch){
      return ['incremental-changes'];
    }

    modulesList = runner.cache.getModulesList(window.location.search);
    if (!modulesList) {
      runner.cache.collectModulesList(window.location.search);
    }
    return modulesList;
  }

  return run;

});
