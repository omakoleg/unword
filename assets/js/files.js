var Unword = Unword || {};

Unword.Files = {
  downloadVocabulary: function(vacabularyId){
    Unword.Storage.get('vocabularies', vacabularyId, function(vocabulary){
      Unword.Models.Question.getActiveByVocabularyId(vacabularyId, function(questions){
        Unword.Files.generateFile(questions, function(fileContents){
          var fileName = vocabulary.name.replace(/[^a-z0-9]/gi,'');
          Unword.Files.downloadFile(fileName, fileContents);
        });
      });
    });
  },
  downloadFile: function(fileName, fileContents){
    fileName += '.csv';
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
      fs.root.getFile(fileName, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          var blob = new Blob([fileContents]);
          fileWriter.addEventListener("writeend", function() {
            chrome.tabs.create({ url: fileEntry.toURL() });
          }, false);
          fileWriter.write(blob);
        }, Unword.logError);
      }, Unword.logError);
    }, Unword.logError);
  },
  generateFile: function(questions, cb){
    var line = "";
    var len = questions.length;
    console.log(questions);
    questions.forEach(function(item, index){
      str = [item.question, item.question_explain, item.answer, item.answer_explain].join(',');
      line += index < len ? str + "\n" : str;
    });
    if(cb){
      console.log(line);
      cb(line);
    }
  } 
}