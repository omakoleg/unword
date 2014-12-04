var Unword = Unword || {};

Unword.logError = function(e){
  console.log(e);
}

Unword.Util = {
  arrayRandom: function(arr){
    return arr[Math.floor(Math.random() * arr.length)]
  },
  arrayIds: function(arr){
    var ids = [];
    arr.forEach(function(v, i){ ids.push(v.id);});
    return ids;
  }
}

Unword.Models = {};
Unword.Models.Question = (function () {
  var module = { }
  module.save = function(data, cb){
    Unword.Storage.save('questions', data, cb);
  }
  module.new = function(data){
    return {
      vocabulary_id: data.vocabulary_id,
      question: data.question,
      question_explain: data.question_explain,
      answer: data.answer,
      answer_explain: data.answer_explain || "",
      is_completed: data.is_completed || 0,
      count_answers: 0
    }
  }
  module.to_csv = function(data){
    return {
      question: data.question,
      question_explain: data.question_explain || "",
      answer: data.answer,
      answer_explain: data.answer_explain || ""
    }
  }
  module.getActiveByVocabularyId = function(vocabulary_id, cb){
    Unword.Storage.where('questions', { index: {
      name: 'vocabulary_id,is_completed', 
      value: [vocabulary_id, 0]
    }}, function(data){
      cb(data);
    });
  }
  module.getByVocabularyId = function(vocabulary_id, cb){
    Unword.Storage.where('questions', { index: {
      name: 'vocabulary_id', 
      value: vocabulary_id
    }}, function(data){
      cb(data);
    });
  }
  return module;
}());

Unword.Models.Vocabulary = (function () {
  var module = { }
  module.new = function(data){
    return {
      name: data.name,
      is_active: data.is_active || 0
    }
  }
  module.save = function(data, cb){
    Unword.Storage.save('vocabularies', data, cb);
  }
  // remove all questions and delete vocabulary. 
  // delete empty vocabulary
  module.deleteRecursive = function(vacabularyId, cb){
    Unword.Models.Question.getActiveByVocabularyId(vacabularyId, function(questions){
      $.when.apply($, $.map(questions, function(item) {
        var def = new $.Deferred();
        Unword.Storage.delete('questions', item.id, function(){
          def.resolve();
        });
        return def.promise();
      })).done(function(){
        Unword.Storage.delete('vocabularies', vacabularyId, function(){
          cb();
        });
      });
    });
  }
  module.getRandomActive = function(cb){
    Unword.Storage.where('vocabularies', {index: { name: "is_active", value: 1 }}, function(data){
      if(data.length == 0){
        cb(null);
      } else {
        var ids = Unword.Util.arrayIds(data);
        var id = Unword.Util.arrayRandom(ids);
        Unword.Storage.get('vocabularies', id, function(vocabulary){
          cb(vocabulary);
        })
      };
    });
  }
  return module;
}());
