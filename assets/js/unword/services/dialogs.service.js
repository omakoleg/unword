angular.module('unword.services')
.service('dialogs', function(){
  return {
    ask: function(message, cb, cb2){
      if(confirm(message)){
        (cb || angular.noop)();
      } else{
        (cb2 || angular.noop)();
      }
    },
    show: function(message){
      alert(message);
    }
  }
});