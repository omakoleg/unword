var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {};
  module.init = function(){
    Unword.Storage.readWords(function(data){
      module.cleanPopup();
      $(document).blur();
    });
    module.attachHandlers();
  }  
  module.cleanPopup = function(){
    var list = document.getElementById("words");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }
  module.attachHandlers = function(){
  }
  return module;
}());

document.addEventListener("DOMContentLoaded", function(){
  Unword.Popup.init();
},false);