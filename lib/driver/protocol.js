define(['lib/jquery',
  'lib/underscore'], function($, _){

  function element(selector, cb){

    var find = _.isFunction(this.find) ? this.find.bind(this) : $,
      $element = _.isString(selector) ? find(selector) : selector;
    $element = $($element).filter(':visible');
    cb = _.isFunction(cb) ? cb : function(){};
    if($element.length > 0){
      cb(null, $element);
    }
    else{
      cb(new Error('Element "' + selector + '" is not found or not currently visible'));
    }
    return this;
  }

  // this function will not filter visible.
  // @todo [taxiahou] deprecate this function if element function is updated.
  function element_nofilter(selector, cb){
    var find = _.isFunction(this.find) ? this.find.bind(this) : $,
      $element = _.isString(selector) ? find(selector) : selector;
    $element = $($element);
    cb = _.isFunction(cb) ? cb : function(){};

    if($element.length > 0){
      setTimeout(function() {
        cb(null, $element);
      }, 0);
    }
    else{
      setTimeout(function() {
        cb(new Error('Element is not found'), $element);
      }, 0);
    }
    return this;
  }

  function options(selector, cb){
    element.call(this, selector, function(err, $el){
      var $opts = $($el.children('option'));
      cb(err, $opts);
    });
    return this;
  }
  
  //n is 1-based index
  function nthOptionAttritubte(selector, n, attr, cb) {
    element.call(this, selector, function(err, $el){
      var $opt = $($el.children('option:nth-child('  + n + ')'));
      cb(err, $opt.attr(attr));
    });
    return this;
  }

  return {
    element_nofilter   : element_nofilter,
    element            : element,
    options            : options,
    nthOptionAttribute : nthOptionAttritubte
  };

});
