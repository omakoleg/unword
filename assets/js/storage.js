var Unword = Unword || {};

Unword.Storage = (function () {
  var module = {
    db: null, // connection
    database_version: 1,
    database_name: 'words-database'
  };
  module.logError = function(e){ 
    console.log(e); 
  }
  module.onupgradeneeded = function(e) {
    console.log('upgraded');
    var db = e.target.result;
    if(!db.objectStoreNames.contains('words')) {
      console.log('update words');
      db.createObjectStore('words', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
    }
    if(!db.objectStoreNames.contains('vocabularies')) {
      console.log('update vocabularies');
      var os = db.createObjectStore('vocabularies', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      os.createIndex("is_active","is_active", { unique: false });
    }
  }
  
  module._tr = function(store_name, callback){
    var transaction = module.db.transaction([store_name], 'readwrite');
    var store = transaction.objectStore(store_name);
    if(callback){ 
      callback(transaction, store);
    }
  }
  
  module.transaction = function(store_name, callback){
    if(module.db){
      module._tr(store_name, callback);
      return;
    }
    var request = indexedDB.open(module.database_name, module.database_version);
    request.onupgradeneeded = module.onupgradeneeded;
    request.onerror = module.logError;
    request.onsuccess = function(e) {
        module.db = e.target.result;
        module._tr(store_name, callback);
    }
  }
    
  module.getCount = function(store_name, callback){
    module.transaction(store_name, function(transaction, store){
      var count = store.count();
      count.onsuccess = function() {
        callback(count.result);
      };
    });
  }
  module.add = function(store_name, data, callback){
    module.transaction(store_name, function(transaction, store){
      var request = store.add(data);
      request.onerror = module.logError;
      request.onsuccess = function(e) { if(callback) { callback(e.target.result); }; }
    });
  }
  module.where = function(store_name, index_name, value, callback){
    module.transaction(store_name, function(transaction, store){
      var index = store.index(index_name);
      var request = index.get(value);
      request.onerror = module.logError;
      request.onsuccess = function(e) { 
        if(callback) { callback(e.target.result); }; 
      }
    });
  }
  module.get = function(store_name, id, callback){
    module.transaction(store_name, function(transaction, store){
      var request = store.get(parseInt(id));
      request.onerror = module.logError;
      request.onsuccess = function(e) {
        callback(e.target.result);
      };
    });
  }
  module.delete = function(store_name, id, callback){
    module.transaction(store_name, function(transaction, store){
      var request = store.delete(parseInt(id));
      request.onerror = module.logError;
      trans.oncomplete = function(e) {
        callback();
      };
    });
  }
  module.update = function(store_name, data, callback){
    module.transaction(store_name, function(transaction, store){
      var request = store.put(data);
      request.onerror = module.logError;
      request.onsuccess = function(e){
        if(callback) { callback(data); };
      };
    });
  }
  module.readAll = function(store_name, completeCallback){
    module.transaction(store_name, function(transaction, store){
      var cursor = store.openCursor();
      var data = [];
      cursor.onsuccess = function(e){
        var res = e.target.result;
        if(res) {
          res.value.id = res.key;
          data.push(res.value);
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
