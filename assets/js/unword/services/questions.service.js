angular.module('unword.services').service('QuestionsService', ['$q', 'dialogs', 
  function($q, dialogs){
    var module = {};
    
    module.getListByVocabularyId = function(vocabulary_id, cb){
      Unword.Models.Question.getByVocabularyId(vocabulary_id, cb);
    }
    
    module.remove = function(question, cb){
      Unword.Storage.delete('questions', question.id, cb || angular.noop);
    }
    
    module.save = function(data, cb){
      Unword.Models.Question.save(data, cb);
    }
    
    return module;
}]);