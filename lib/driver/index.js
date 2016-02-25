define(['lib/underscore',
    'lib/jquery',
    'component/test/driver/action',
    'component/test/driver/protocol',
    'component/test/driver/property',
    'component/test/driver/state',
    'component/test/driver/utility'
], function(_, $, action, protocol, property, state, utility){

  var exports =  _.extend({}, action, protocol, property, state, utility);

  exports.context = function(element, cb){
    protocol.element(element, function(error, $el){
      cb(null, _.extend($el, exports));
    });
    return this;
  };

  // @todo [taxiahou] deprecate this if element_filter is updated with element.
  exports.context_nofilter = function(element, cb){
    protocol.element_nofilter(element, function(error, $el){
      cb(null, _.extend($el, exports));
    });
    return this;
  }

  return exports;

});
