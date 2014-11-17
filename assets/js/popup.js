var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {};
  module.init = function(){
    Unword.Storage.readWords(function(data){
      console.log(data);
    });
    module.attachHandlers();
  }  
  module.attachHandlers = function(){
    
  }
  return module;
}());

$(function(){
  Unword.Popup.init();
  setTimeout(function(){
    $("#answer").focus();
  }, 300);
});
