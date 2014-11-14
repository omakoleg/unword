var unwordPopup = {
  init: function(){
    unword.initDb(function(){
      unword.readData(function(){
        // will remove dlete buttom selection
        document.activeElement.blur();
      });
    });
  },
  attachDownloadHandler: function(){
    document.getElementById('download-link-txt').addEventListener("click", function(e){
      // unword.downloadFile('txt', document.getElementById('file-name').getAttribute('value'));
    });
    document.getElementById('download-link-csv').addEventListener("click", function(e){
      unword.downloadFile('csv', document.getElementById('file-name').getAttribute('value'));
    });
    document.getElementById('file-name').setAttribute('value', unword.file_name_default);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  unwordPopup.init();
  unwordPopup.attachDownloadHandler();
},false);