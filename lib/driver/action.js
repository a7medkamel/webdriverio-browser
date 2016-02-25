define(['lib/jquery',
  'lib/underscore',
  'component/test/driver/protocol'], function($, _, protocol){

  function clearElement(selector, cb) {
    return setValue.call(this, selector, '', cb);
  }

  function click(selector, cb){
    protocol.element.call(this, selector, function(err, $el){
      // jquery has awkward radio click implementation, knockout will not notice jquery's click
      // should set checked before jquery click triggered
      // see https://github.com/knockout/knockout/issues/1722
      if (err) {
        if(_.isFunction(cb)){
         cb(err);
        }
      } else {
        if ($el.is(':radio')) {
          $el.prop('checked', true);
        }
        $el.click();
        if(_.isFunction(cb)){
          cb();
        }
      }
    });
    return this;
  }

  function setValue(selector, value, cb){
    protocol.element.call(this, selector, function(err, $el){
      $el.val(value).change().blur().trigger('input');
      if(_.isFunction(cb)){
        cb(err);
      }
    });

    return this;
  }

  /*
   * Select option that display text matching the argument.
   *
   * @param {String} selectElem select element that contains the options
   * @param {String} text       text of option element to get selected
   * @callbackParameter error
   */
  function selectByVisibleText(selectElem, text, cb) {
    protocol.element.call(this, selectElem, function(err, $el) {
      $el.children('option').filter(function() {
        return $(this).text() === text;
      }).prop('selected', true);

      // when user change selected option by hand, change event is triggered on 'select' element.
      // but change selected option via $.fn.prop on 'option' element does not trigger 'select' element's change event.
      // knockout use change event to detect select option's change.
      // it's hard to mimic user's action like opening dropdown menu of 'select' element, then clicking expect option.
      // there're several attempts here: http://stackoverflow.com/questions/249192/how-can-you-programmatically-tell-an-html-select-to-drop-down-for-example-due
      $el.change();

      if(_.isFunction(cb)) {
        cb(err);
      }
    });

    return this;
  }

  return {
    clearElement        : clearElement,
    click               : click,
    selectByValue       : setValue,
    setValue            : setValue,
    selectByVisibleText : selectByVisibleText
  };

});
