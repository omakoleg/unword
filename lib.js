/*
  Just plain funciton to reach functionality. 
*/
var unword = {
  db: null,
  database_version: 12,
  database_name: 'words-database',
  store_name: 'words4',
  file_name_default: 'words',
  data: [],
  requestFileSystem: null,
  /*  actions */
  objectStore: function(mode){
    return unword.transaction(mode).objectStore(unword.store_name);
  },
  transaction: function(mode){
    if(!mode){ mode = "readwrite"; }
    return unword.db.transaction([unword.store_name], mode);
  },
  initDb: function(callback){
    var request = indexedDB.open(unword.database_name, unword.database_version);
    request.onupgradeneeded = function(e) {
      var thisDB = e.target.result;
      if(!thisDB.objectStoreNames.contains(unword.store_name)) {
        thisDB.createObjectStore(unword.store_name, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
      }
    }
    request.onsuccess = function(e) {
        unword.db = e.target.result;
        unword.setBadgeCount();
        if(callback){ callback(); }
    }
    request.onerror = unword.logError;
  },
  addData: function(text, web, callback){
    var store = unword.objectStore('readwrite');
    var request = store.add({
      text: text,
      web: web
    });
    request.onerror = unword.logError;
    request.onsuccess = function(e) { if(callback) { callback(); }; }
  },
  setBadgeCount: function(){
    var store = unword.objectStore('readonly');
    var count = store.count();
    count.onsuccess = function() {
      chrome.browserAction.setBadgeText({text: String(count.result)});
    }
  },
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
  cleanPopup: function(){
    // clear list
    var list = document.getElementById("words");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  },
  readData: function(callback){
    unword.cleanPopup();
    // load items
    unword.data = [];
    var trans = unword.transaction('readwrite');
    var store = trans.objectStore(unword.store_name);
    var cursor = store.openCursor();
    cursor.onsuccess = function(e){
      var res = e.target.result;
      if(res) {
          unword.data.push(res.value);
          unword.buildItem(res);
          res.continue();
        }
    };
    trans.oncomplete = function(e) {
      if(callback){ callback(); }
    };
  },
  logError: function(e){
    console.log(e);
  },
  getWord: function(id, callback){
    var store = unword.objectStore('readwrite');
    var request = store.get(parseInt(id));
    request.onsuccess = function(e) {
      callback(e.target.result);
    };
    request.onerror = unword.logError;
  },
  deleteItem: function(e){
    var id = e.target.getAttribute('data-id');
    var trans = unword.transaction('readwrite');
    var store = trans.objectStore(unword.store_name);
    var request = store.delete(parseInt(id));
    trans.oncomplete = function(e) {
      unword.readData();
      unword.setBadgeCount();
    };
    request.onerror = unword.logError;
  }, 
  saveChanges: function(e, callback){
    var id = e.target.getAttribute('data-id');
    var text = e.target.innerHTML;
    unword.getWord(id, function(data){
      data.text = text;
      var store = unword.objectStore('readwrite');
      var request = store.put(data);
      request.onsuccess = function(e){
        console.log(e);
        if(callback) { callback(data); };
      };
      request.onerror = unword.logError;
    })
  },
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

