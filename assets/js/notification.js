var Unword = Unword || {};

Unword.Notification = (function () {
  var module = {};
  module.show = function(message, delay){
    var notification = chrome.notifications.create('message', {
      message: message,
      type: 'basic',
      iconUrl: 'assets/images/icon48.png',
      title: 'Unword'
    }, function(){ /* none */ });
    setTimeout(function(){ 
      chrome.notifications.clear('message', function(){ /* none */});
    }, delay || 5000);
  }
  return module;
}());

Unword.Tick = (function () {
  var module = {
    warnShown: false
  };
  module.run = function(){
    setTimeout(function(){
      Unword.Notification.show("I will remind You to answer some questions");
    }, 5000);
    chrome.alarms.onAlarm.addListener(function(alarm) {
      Unword.Models.Vocabulary.getRandomActive(function(item){
        if(item){
          Unword.Notification.show("It is time to answer some questions.");
        } else if(!module.warnShown){
          module.warnShown = true;
          Unword.Notification.show('You didnt enable any vocabularies yet. Open extension settings and click activate.', 15000);
        }
      });
    });
    chrome.alarms.create("Start", { periodInMinutes: 30 });
    // setTimeout(function(){
//       chrome.alarms.clear("Start");
//       Unword.Notification.show('Tick cleared', 1);
//     }, 20* 1000);
  }
  return module;
}());
