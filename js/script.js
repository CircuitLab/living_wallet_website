$(function(){

  $("#carrousel").carrousel({
   "isPrevNext":true,
   });

  if (!window.console){
    window.console = {
        log : function(msg){
            // do nothing.
        }
    };
  }
});