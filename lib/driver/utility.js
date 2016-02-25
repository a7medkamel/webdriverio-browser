define(['lib/jquery',
  'lib/underscore',
  'component/test/driver/protocol'
], function($, _, protocol){

  function waitForExist(selector, ms, reverse){
    // get the callback from the last parameter
    var cb = _.last(arguments);
    cb = _.isFunction(cb) ? cb : _.noop();

    //parameter check
    if (!_.isString(selector)) {
      cb(new Error('The selector is not a string value'));
    }

    if(_.isNumber(ms)) {
      reverse = _.isBoolean(reverse) ? reverse : false;
    } else if(_.isBoolean(ms)) {
      ms = 500;
      reverse = ms;
    } else {
      ms = 500;
      reverse = false;
    }

    var elFunc = _.isFunction(this.element)
                   ? this.element.bind(this)
                   : protocol.element.bind(protocol);

    var startTime = new Date().getTime();

    var timer = setInterval(function() {
      elFunc(selector, function(error, $el){
        if (!error && $el.length) {
          clearInterval(timer);
          cb(null, !reverse);
        } else if (new Date().getTime() - startTime > ms) {
          clearInterval(timer);
          cb(new Error('The expected elements do not exist or are invisible'), reverse);
        }
      });
    }, 10);
  }

  // @todo [wanju] implement using promise like webdriverio ?
  function pause(ms, callback) {
    setTimeout(callback, ms);
  }
  
  return {
    waitForExist: waitForExist,
    pause: pause
  };

});