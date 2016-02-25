define(['lib/jquery',
  'lib/underscore',
  'component/test/driver/protocol'
], function($, _, protocol){

  // @todo [taxiahou] replace element_nofilter with element if element is updated.
  function isEnabled(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el){
      cb(error, $el.is(':enabled'));
    });
    return this;
  }

  // @todo [taxiahou] replace element_nofilter with element if element is updated.
  function isVisible(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el){
      cb(error, $el.is(':visible'));
    });
    return this;
  }
  
  function exists(selector, cb) {
    var find = _.isFunction(this.find) ? this.find.bind(this) : $,
        $element = _.isString(selector) ? find(selector) : selector;
    cb = _.isFunction(cb) ? cb : function(){};
    var exists = $element.length > 0;
    cb(null, exists);
    return this;
  }

  function isChecked(selector, cb) {
    var elFunc = _.isFunction(this.element)
                   ? this.element.bind(this)
                   : protocol.element.bind(protocol);

    elFunc(selector, function(error, $el){
      cb(error, $el.is(':checked'));
    });
    return this;
  }

  // TODO [zhbliu] replace element_nofilter with element if element is updated.
  function isSelected(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el){
      cb(error, $el.is(':checked, :selected'));
    });
    return this;
  }

  return {
    isEnabled  : isEnabled,
    isVisible  : isVisible,
    exists     : exists,
    isChecked  : isChecked,
    isSelected : isSelected
  };

});
