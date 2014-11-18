var Unword = Unword || {};

Unword.Util = {
  arrayRandom: function(arr){
    return arr[Math.floor(Math.random() * arr.length)]
  },
  arrayIds: function(arr){
    var ids = [];
    $.each(arr, function(i, v){ ids.push(v.id);});
    return ids;
  }
}

Unword.Models = {};
Unword.Models.Word = (function () {
  var module = { }
  module.new = function(data){
    return {
      text: data.text,
      vocabulary_id: data.vocabulary_id,
      example: data.example || "",
      language: data.language || 'en',
      language_to: data.language_to || 'ru',
      translation: data.translation || "",
      is_completed: data.is_completed || 0,
      count_answers: 0
    }
  }
  module.getActiveByVocabularyId = function(vocabulary_id, cb){
    Unword.Storage.where('words', { index: {
      name: 'vocabulary_id,is_completed', 
      value: [vocabulary_id, 0]
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
