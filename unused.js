// chrome.contextMenus.create({
//   title: 'Memorize',
//   id: 'unword-context',
//   contexts: ['selection'],
// });
// 
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId === "unword-context") { 
//     Unword.Storage.addQuestion(info['selectionText'], function(){
//       Unword.Badge.update();
//     });
//   }
// });

// Unword.Notification.show('Started');
// Unword.Badge.update();
// indexedDB.deleteDatabase('questions-database');
// indexedDB.deleteDatabase('questions-database-2');


// not used
Unword.Badge = (function () {
  var module = {};
  module.update = function(){
    Unword.Storage.count('vocabularies', { index: {name: "is_active", value: 1 }}, function(count){
      chrome.browserAction.setBadgeText({text: String(count)});
    })
  }
  return module;
}());