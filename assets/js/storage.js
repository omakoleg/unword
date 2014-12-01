var Unword = Unword || {};

Unword.Storage = (function () {
  var module = {
    db: null, // connection
    database_version: 1,
    database_name: 'questions-database'
  };
  module.logError = function(e){ 
    console.log(e); 
  }
  module.onupgradeneeded = function(e) {
    console.log('upgraded');
    var db = e.target.result;
    if(!db.objectStoreNames.contains('questions')) {
      var os = db.createObjectStore('questions', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      os.createIndex("vocabulary_id","vocabulary_id", { unique: false });
      os.createIndex("vocabulary_id,is_completed",["vocabulary_id", "is_completed"], { unique: false });
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
  module.count = function(store_name, options, callback){
    module.transaction(store_name, function(transaction, store){
      var countRequest = null;
      if(options.index){
        indexer = store.index(options.index.name);
        countRequest = indexer.count(options.index.value);
      } else {
        countRequest = store.count();
      }
      countRequest.onsuccess = function() {
        callback(countRequest.result);
      };
    });
  }
  module.save = function(store_name, data, cb){
    module.transaction(store_name, function(transaction, store){
      var request = null;
      if(data.id){
        request = store.put(data);
      } else {
        request = store.add(data);
      }
      request.onerror = module.logError;
      request.onsuccess = function(e){
        if(cb){ cb(e.target.result); }; // will return id
      };
    });
  }
  
  module.add = function(store_name, data, callback){
    module.transaction(store_name, function(transaction, store){
      var request = store.add(data);
      request.onerror = module.logError;
      request.onsuccess = function(e) { 
        if(callback) { callback(e.target.result); }; 
      }
    });
  }
  // use index to get list, without index will get all 
  module.where = function(store_name, options, callback){
    module.transaction(store_name, function(transaction, store){
      var cursor = null;
      if(options.index){
        var indexer = store.index(options.index.name);
        cursor = indexer.openCursor(options.index.value);
      } else {
        cursor = store.openCursor();
      }
      var data = [];
      cursor.onerror = module.logError;
      cursor.onsuccess = function(e){
        var res = e.target.result;
        if(res) {
          data.push(res.value);
          res.continue();
        }
      };
      transaction.oncomplete = function(e) {
        callback(data);
      };
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
      transaction.oncomplete = function(e) {
        if(callback) { callback(); };
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
