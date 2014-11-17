var Unword = Unword || {};

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
      is_completed: data.is_completed || 0
    }
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
  module.wordsCount = function(vocabulery_id){
    return 10;
  }
  return module;
}());
