chrome.contextMenus.create({
    title: 'Memorize',
    id: 'unword-context',
    contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "unword-context") { 
       initDb(function(){
         addData(info['selectionText'], info['pageUrl']);
       });
    }
});