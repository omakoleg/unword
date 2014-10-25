var db = null;
var store_name = "words3";

function setCount(){
  var store = db.transaction([store_name], 'readonly')
    .objectStore(store_name);
  var count = store.count();
  count.onsuccess = function() {
    chrome.browserAction.setBadgeText({text: String(count.result)});
  }
}

function initDb(callback){
  var openRequest = indexedDB.open("words-database", 11);
  openRequest.onupgradeneeded = function(e) {
    console.log("onupgradeneeded");
    var thisDB = e.target.result;
    if(!hisDB.objectStoreNames.contains(store_name)) {
      thisDB.createObjectStore(store_name, { 
        keyPath: 'id', 
        autoIncrement: true 
      });
    }
  }
  openRequest.onsuccess = function(e) {
      console.log("Success!");
      db = e.target.result;
      setCount();
      callback();
  }
  openRequest.onerror = function(e) {
      console.log("Error");
      console.dir(e);
  }
}

function addData(text, web){
  var word = {
    text: text,
    web: web
  }
  var transaction = db.transaction([store_name],"readwrite");
  var store = transaction.objectStore(store_name);
  var request = store.add(word);
  request.onerror = function(e) { console.log("Error",e.target.error.name); }
  request.onsuccess = function(e) { }
}

function readData(){
  // clear list
  var list = document.getElementById("words");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  // load items
  var transaction = db.transaction([store_name], "readonly");
  var objectStore = transaction.objectStore(store_name);
  var cursor = objectStore.openCursor();
  cursor.onsuccess = buildItem;
}

function logIt(e){
  console.log(e);
}

function getWord(id, callback){
  var trans = db.transaction([store_name], "readwrite");
  var store = trans.objectStore(store_name);
  var request = store.get(parseInt(id));
  request.onsuccess = function(e) {
    callback(e.target.result);
  };
  request.onerror = logIt;
}

function deleteItem(e){
  var id = e.target.getAttribute('data-id');
  var trans = db.transaction([store_name], "readwrite");
  var store = trans.objectStore(store_name);
  var request = store.delete(parseInt(id));
  trans.oncomplete = function(e) {
    readData();
    setCount();
  };
  request.onerror = logIt;
}

function saveChanges(e, callback){
  var id = e.target.getAttribute('data-id');
  var text = e.target.innerHTML;
  getWord(id, function(data){
		data.text = text;
    var trans = db.transaction([store_name], "readwrite");
    var store = trans.objectStore(store_name);
    var request = store.put(data);
    request.onsuccess = function(e){
      console.log(e);
      if(callback) { callback(data); };
    };
    request.onerror = logIt;
  })
}

function buildItem(e){
  var res = e.target.result;
  if(res) {
      var list = document.getElementById("words");
      var div = document.createElement("div");
      var container = document.createElement("div");
      var a = document.createElement("a");
      a.setAttribute("data-id", res.key);
      a.setAttribute("href", '#');
      a.addEventListener("click", deleteItem);
      a.textContent = "delete";
      div.textContent = res.value.text;
      div.setAttribute("contenteditable", "true");
      div.setAttribute("data-id", res.key);
      div.addEventListener("input", saveChanges, false);
      container.appendChild(a);
      container.appendChild(div);
      container.className = "words-item";
      list.appendChild(container);
      res.continue();
  }
}
// will set counter
document.addEventListener("DOMContentLoaded", function(){
  initDb(function(){ /*empty*/ });
},false);
