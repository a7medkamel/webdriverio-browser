define(['lib/jquery',
  'lib/underscore',
  'component/test/driver/protocol'
], function($, _, protocol){

  function getValue(selector, cb){
    var elFunc = _.isFunction(this.element)
                   ? this.element.bind(this)
                   : protocol.element.bind(protocol);

    elFunc(selector, function(error, $el){
      cb(error, $el.val());
    });

    return this;
  }

  // @todo [taxiahou] replace element_nofilter with element if element is updated.
  function getText(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el) {
      cb(error, $el.text());
    });

    return this;
  }
  
  function getHtml(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el) {
      cb(error, $el.html());
    });

    return this;
  }

  // @todo [taxiahou] replace element_nofilter with element if element is updated.
  function getAttribute(selector, attributeName, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
                   ? this.element_nofilter.bind(this)
                   : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el) {
      cb(error, $el.attr(attributeName));
    });

    return this;
  }

  // @todo [taxiahou] replace element_nofilter with element if element is updated.
  function getLocation(selector, cb) {
    var elFunc = _.isFunction(this.element_nofilter)
               ? this.element_nofilter.bind(this)
               : protocol.element_nofilter.bind(protocol);

    elFunc(selector, function(error, $el) {
      var offset = $el.offset();
      cb(error, { x: offset.left, y: offset.top });
    });

    return this;
  }

  return {
    getValue     : getValue,
    getText      : getText,
    getHtml      : getHtml,
    getAttribute : getAttribute,
    getLocation  : getLocation
  };

});
