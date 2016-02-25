define(['lib/jquery'], function($){

  var $container = $('body>#container');
  if($container.length === 0){
    $container = $('<div id="container"/>').appendTo('body');
  }

  function render(instance){
    instance.render();
    $container.append(instance.$el);
    return instance;
  }

  // @todo [taxiahou akamel] Consider renaming to render as it really did a render thing instaed of mock a view.
  function view(Constructor, options){
    var instance = new Constructor(options);
    return render(instance);
  }

  function cleanup(){
    $container.empty();
  }

  function cleanupModal(){
    var $modal = $('.modal')
      , $modalBackdrop = $('.modal-backdrop');
    
    $modal.remove();
    $modalBackdrop.remove();
  }

  return {
    render       : render,
    view         : view,
    cleanup      : cleanup,
    cleanupModal : cleanupModal,
    $container   : $container
  };
});
