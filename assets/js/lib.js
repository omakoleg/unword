var Unword = Unword || {};

Unword.Notification = (function () {
  var module = {};
  module.register = function(){
    // It is added to manifest so no need to register it again
    // if (Notification.permission !== 'denied') {
    //   Notification.requestPermission(function (permission) {
    //     // Whatever the user answers, we make sure we store the information
    //     if(!('permission' in Notification)) {
    //       Notification.permission = permission;
    //     }
    //   });
    // }
  }
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
    }, 20* 1000)
  }
  return module;
}());

Unword.Badge = (function () {
  var module = {};
  module.update = function(){
    Unword.Storage.getWordsCount(function(count){
      chrome.browserAction.setBadgeText({text: String(count)});
    })
  }
  return module;
}());


Unword.Storage = (function () {
  var module = {
    db: null, // connection
    database_version: 13,
    database_name: 'words-database',
    store_name: 'words4'
  };
  module.logError = function(e){ 
    console.log(e); 
  }
  module.onupgradeneeded = function(e) {
    var db = e.target.result;
    if(!db.objectStoreNames.contains(module.store_name)) {
      db.createObjectStore(module.store_name, { 
        keyPath: 'id', 
        autoIncrement: true 
      });
    }
  }
  
  module._tr = function(mode, callback){
    var transaction = module.db.transaction([module.store_name], mode);
    var store = transaction.objectStore(module.store_name);
    if(callback){ 
      callback(transaction, store);
    }
  }
  
  module.transaction = function(mode, callback){
    if(!mode){ mode = "readwrite"; }
    if(module.db){
      module._tr(mode, callback);
      return;
    }
    var request = indexedDB.open(module.database_name, module.database_version);
    request.onupgradeneeded = module.onupgradeneeded;
    request.onerror = module.logError;
    request.onsuccess = function(e) {
        module.db = e.target.result;
        module._tr(mode, callback);
    }
  }
    
  module.getWordsCount = function(callback){
    module.transaction('readonly', function(transaction, store){
      var count = store.count();
      count.onsuccess = function() {
        callback(count.result);
      };
    });
  }
  module.addWord = function(text, callback){
    module.transaction('readwrite', function(transaction, store){
      var request = store.add({
        text: text
      });
      request.onerror = module.logError;
      request.onsuccess = function(e) { if(callback) { callback(); }; }
    });
  }
  module.getWord = function(id, callback){
    module.transaction('readonly', function(transaction, store){
      var request = store.get(parseInt(id));
      request.onerror = module.logError;
      request.onsuccess = function(e) {
        callback(e.target.result);
      };
    });
  }
  module.deleteWord = function(id, callback){
    module.transaction('readwrite', function(transaction, store){
      var request = store.delete(parseInt(id));
      request.onerror = module.logError;
      trans.oncomplete = function(e) {
        callback();
      };
    });
  }
  module.updateWord = function(id, data_update, callback){
    module.getWord(id, function(word){
      // update always
      if(data_update.text){
        word.text = data_update.text;
      }
      module.transaction('readwrite', function(transaction, store){
        var request = store.put(word);
        request.onerror = module.logError;
        request.onsuccess = function(e){
          if(callback) { callback(word); };
        };
      });
    });
  }
  module.readWords = function(completeCallback){
    module.transaction('readonly', function(transaction, store){
      var cursor = store.openCursor();
      var data = [];
      cursor.onsuccess = function(e){
        var res = e.target.result;
        if(res) {
          data.push({
            id: res.key,
            text: res.value.text
          });
          res.continue();
        }
      };
      transaction.oncomplete = function(e) {
        completeCallback(data);
      };
    });
  }
  
  return module;
}());

/*
  Just plain funciton to reach functionality. 
*/
var unword = {
  // db: null,
  // database_version: 12,
  // database_name: 'words-database',
  // store_name: 'words4',
  // file_name_default: 'words',
  // data: [],
  // requestFileSystem: null,
  /*  actions */
  // objectStore: function(mode){
  //   return unword.transaction(mode).objectStore(unword.store_name);
  // },
  // transaction: function(mode){
  //   if(!mode){ mode = "readwrite"; }
  //   return unword.db.transaction([unword.store_name], mode);
  // },
  // initDb: function(callback){
  //   var request = indexedDB.open(unword.database_name, unword.database_version);
  //   request.onupgradeneeded = function(e) {
  //     var thisDB = e.target.result;
  //     if(!thisDB.objectStoreNames.contains(unword.store_name)) {
  //       thisDB.createObjectStore(unword.store_name, { 
  //         keyPath: 'id', 
  //         autoIncrement: true 
  //       });
  //     }
  //   }
  //   request.onsuccess = function(e) {
  //       unword.db = e.target.result;
  //       unword.setBadgeCount();
  //       if(callback){ callback(); }
  //   }
  //   request.onerror = unword.logError;
  // },
  // addData: function(text, web, callback){
  //   var store = unword.objectStore('readwrite');
  //   var request = store.add({
  //     text: text,
  //     web: web
  //   });
  //   request.onerror = unword.logError;
  //   request.onsuccess = function(e) { if(callback) { callback(); }; }
  // },
  // setBadgeCount: function(){
  //   var store = unword.objectStore('readonly');
  //   var count = store.count();
  //   count.onsuccess = function() {
  //     chrome.browserAction.setBadgeText({text: String(count.result)});
  //   }
  // },
  generateFileContents: function(format){
    var line = "";
    if(format == 'txt'){
      unword.data.forEach(function(elem){
        line += elem.text + "\n";
      });
    }
    if(format == 'csv'){
      var _string;
      var len = unword.data.length;
      unword.data.forEach(function(item, index){
         str = [item.text, item.web].join(',');
         line += index < len ? str + "\n" : str;
      });
    }
    return line;
  },
  downloadFile: function(format, file_name){
    if(!format){
      format = 'txt';
    }
    if(!file_name){
      file_name = unword.file_name_default;
    }
    file_name = file_name + '.' + format;
    if(unword.data.length == 0){
      return; // stupid stub
    }
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
      fs.root.getFile(file_name, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          var line = unword.generateFileContents(format);
          var blob = new Blob([line]);
          fileWriter.addEventListener("writeend", function() {
            chrome.tabs.create({ url: fileEntry.toURL() });
          }, false);
          fileWriter.write(blob);
        }, unword.logError);
      }, unword.logError);
    }, unword.logError);
  },
//   cleanPopup: function(){
//     // clear list
//     // var list = document.getElementById("words");
// //     while (list.firstChild) {
// //       list.removeChild(list.firstChild);
// //     }
//   },
  // readData: function(callback){
  //   unword.cleanPopup();
  //   // load items
  //   unword.data = [];
  //   var trans = unword.transaction('readwrite');
  //   var store = trans.objectStore(unword.store_name);
  //   var cursor = store.openCursor();
  //   cursor.onsuccess = function(e){
  //     var res = e.target.result;
  //     if(res) {
  //         unword.data.push(res.value);
  //         unword.buildItem(res);
  //         res.continue();
  //       }
  //   };
  //   trans.oncomplete = function(e) {
  //     if(callback){ callback(); }
  //   };
  // },
  // logError: function(e){
  //   console.log(e);
  // },
  // getWord: function(id, callback){
  //   var store = unword.objectStore('readwrite');
  //   var request = store.get(parseInt(id));
  //   request.onsuccess = function(e) {
  //     callback(e.target.result);
  //   };
  //   request.onerror = unword.logError;
  // },
  // deleteItem: function(e){
  //   var id = e.target.getAttribute('data-id');
  //   var trans = unword.transaction('readwrite');
  //   var store = trans.objectStore(unword.store_name);
  //   var request = store.delete(parseInt(id));
  //   trans.oncomplete = function(e) {
  //     unword.readData();
  //     unword.setBadgeCount();
  //   };
  //   request.onerror = unword.logError;
  // }, 
  // saveChanges: function(e, callback){
  //   var id = e.target.getAttribute('data-id');
  //   var text = e.target.innerHTML;
  //   unword.getWord(id, function(data){
  //     data.text = text;
  //     var store = unword.objectStore('readwrite');
  //     var request = store.put(data);
  //     request.onsuccess = function(e){
  //       console.log(e);
  //       if(callback) { callback(data); };
  //     };
  //     request.onerror = unword.logError;
  //   })
  // },
  buildItem: function(res){
    var list = document.getElementById("words");
    var div = document.createElement("div");
    var container = document.createElement("div");
    var a = document.createElement("a");
    a.setAttribute("data-id", res.key);
    a.setAttribute("href", '#');
    a.addEventListener("click", unword.deleteItem);
    a.textContent = "delete";
    div.textContent = res.value.text;
    div.setAttribute("contenteditable", "true");
    div.setAttribute("data-id", res.key);
    div.addEventListener("input", unword.saveChanges, false);
    div.addEventListener('keypress',function(e){
      if (e.keyCode == 13){
        document.activeElement.blur();
        e.preventDefault();
      }
    });
    container.appendChild(a);
    container.appendChild(div);
    container.className = "words-item";
    list.appendChild(container);
  }
}

