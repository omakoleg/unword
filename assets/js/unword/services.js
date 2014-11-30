angular.module('unword.services')
.service('dialogs', function(){
  return {
    ask: function(message, cb, cb2){
      if(confirm(message)){
        cb();
      } else if(cb2){
        cb2();
      }
    },
    show: function(message){
      alert(message);
    }
  }
})
.service('VocabulariesService', function($q, dialogs){
  var module = {};
  module.loadVocabularies = function(cb){
    Unword.Storage.readAll('vocabularies', function(list){
      cb(list);
    });
  }
  module.loadCsvFile = function(file, cb){
    Papa.parse(file, {
      header: true,
    	complete: function(results) {
    		console.log(file.name, results);
        if(results.data.length){
          var name = file.name.slice(0, -4);
          module._generateVocabularyWithQuestions(name, results.data, cb);
        }
    	}
    });   
  }
  module._generateVocabularyWithQuestions = function(name, list, cb){             
    Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: name}), function(id){
      var defers = [];
      list.forEach(function(item, index){
        if(item.question && item.answer){ // required
          var deferred = $q.defer();
          defers.push(deferred);
          item.vocabulary_id = id; //voc_id
          Unword.Storage.add('questions', Unword.Models.Question.new(item), function(){
            deferred.resolve();
          });
        }
      });
      $q.all(defers).then(function(){
        cb();
      });
    });
  }
  //
  module.remove = function(vocabulary, cb){
    if(dialogs.ask('Delete this vocabulary?', function(){
      Unword.Models.Vocabulary.deleteRecursive(vocabulary.id, cb);
    }));
  }
  //
  module.toggleActive = function(vocabulary){
    vocabulary.is_active = vocabulary.is_active ? 0 : 1;
    Unword.Storage.update('vocabularies', vocabulary);
  }
  // handler to generate and show csv file
  module.generateCsvFile = function(vocabularyId){
    Unword.Storage.get('vocabularies', vocabularyId, function(vocabulary){
      Unword.Models.Question.getActiveByVocabularyId(vocabularyId, function(questions){
        module._generateCsvFormat(questions, function(fileContents){
          var fileName = vocabulary.name.replace(/[^a-z0-9]/gi,'');
          module._downloadFile(fileName, fileContents);
        });
      });
    });
  }
  // trigger csv file doenload using browser api
  module._downloadFile = function(fileName, fileContents){
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
  }
  // generate csv contents from list of questions
  module._generateCsvFormat = function(questions, cb){
    var data = [];
    console.log(questions);
    questions.forEach(function(item, index){
      data.push(Unword.Models.Question.to_csv(item));
    });
    var csv = Papa.unparse(data);
    if(cb){
      console.log(csv);
      cb(csv);
    }
  } 
  
  return module;
})