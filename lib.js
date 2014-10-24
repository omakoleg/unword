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
    // if(!hisDB.objectStoreNames.contains(OBJECT_STORE)) {
      thisDB.createObjectStore(store_name, { keyPath: 'id', autoIncrement: true });
    // }
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
  var transaction = db.transaction([store_name], "readonly");
  var objectStore = transaction.objectStore(store_name);
  var cursor = objectStore.openCursor();
  cursor.onsuccess = function(e) {
    var res = e.target.result;
    if(res) {
        var list = document.getElementById("words");
        var div = document.createElement("div");
        div.textContent = res.value.text;
        list.appendChild(div);
        res.continue();
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
 initDb(function(){
   addData();
 });
},false);

