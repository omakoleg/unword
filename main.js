chrome.contextMenus.create({
  title: 'Memorize',
  id: 'unword-context',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "unword-context") { 
    unword.initDb(function(){
      unword.addData(info['selectionText'], info['pageUrl'], function(){
      	unword.setBadgeCount();
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function(){
  unword.initDb(function(){ /*empty*/ });
}, false);
