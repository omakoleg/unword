// chrome.contextMenus.create({
//   title: 'Memorize',
//   id: 'unword-context',
//   contexts: ['selection'],
// });
// 
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId === "unword-context") { 
//     Unword.Storage.addWord(info['selectionText'], function(){
//       Unword.Badge.update();
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", function(){
  Unword.Notification.register();
  // Unword.Tick.run();
  // Unword.Notification.show('Started');
  Unword.Badge.update();
}, false);
