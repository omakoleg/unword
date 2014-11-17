var Unword = Unword || {};

Unword.Notification = (function () {
  var module = {};
  module.show = function(message, timeout){
    if(!timeout){ timeout = 1; }
    var notification = new Notification(message);
    setTimeout(function(){ notification.close(); }, timeout * 1000);
  }
  
  return module;
}());

Unword.Tick = (function () {
  var module = {};
  module.run = function(){
    chrome.alarms.onAlarm.addListener(function(alarm) {
      Unword.Notification.show('Tick', 1);
    });
    chrome.alarms.create("Start", { periodInMinutes:0.1 });
    setTimeout(function(){
      chrome.alarms.clear("Start");
      Unword.Notification.show('Tick cleared', 1);
    }, 20* 1000);
  }
  return module;
}());

Unword.Badge = (function () {
  var module = {};
  module.update = function(){
    Unword.Storage.getCount('words', function(count){
      chrome.browserAction.setBadgeText({text: String(count)});
    })
  }
  return module;
}());